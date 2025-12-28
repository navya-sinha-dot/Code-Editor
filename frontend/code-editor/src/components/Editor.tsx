import { useCallback, useEffect, useRef, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom, useMyPresence, useOthers } from "../../liveblocks.config";
import type { editor } from "monaco-editor";
import axios from "axios";
import * as monaco from "monaco-editor";

interface EditorProps {
  language: string;
}

export default function Editor({ language }: EditorProps) {
  const room = useRoom();
  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const [ready, setReady] = useState(false);

  const yProvider = getYjsProviderForRoom(room);
  const hydratedRef = useRef(false);

  const [_, updateMyPresence] = useMyPresence();
  const others = useOthers();

  useEffect(() => {
    if (!room || hydratedRef.current) return;

    const [roomId, fileName] = room.id.split(":");
    if (!roomId || !fileName) {
      setReady(true);
      return;
    }

    const yText = yProvider.getYDoc().getText("monaco");

    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/files/${roomId}/file/${fileName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data?.content && yText.length === 0) {
          yText.insert(0, res.data.content);
        }
      } finally {
        hydratedRef.current = true;
        setReady(true);
      }
    })();
  }, [room, yProvider]);

  useEffect(() => {
    if (!editorRef || !ready) return;

    const yText = yProvider.getYDoc().getText("monaco");

    const binding = new MonacoBinding(
      yText,
      editorRef.getModel()!,
      new Set([editorRef]),
      yProvider.awareness as any
    );

    return () => binding.destroy();
  }, [editorRef, ready, yProvider]);

  useEffect(() => {
    if (!room || !editorRef || !ready) return;

    const [roomId, fileName] = room.id.split(":");

    const interval = setInterval(() => {
      axios.post(
        `http://localhost:3000/api/files/${roomId}/file/${fileName}`,
        {
          content: editorRef.getValue(),
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [room, editorRef, ready, language]);

  useEffect(() => {
    if (!editorRef) return;

    const disposable = editorRef.onDidChangeCursorPosition((e) => {
      updateMyPresence({
        cursor: {
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        },
      });
    });

    return () => disposable.dispose();
  }, [editorRef, updateMyPresence]);

  useEffect(() => {
    if (!editorRef) return;

    const decorations = others
      .map((other) => {
        const cursor = other.presence?.cursor;
        if (!cursor) return null;

        const color = stringToColor(other.connectionId);
        const name = other.info?.name ?? "User";

        return {
          range: new monaco.Range(
            cursor.lineNumber,
            cursor.column,
            cursor.lineNumber,
            cursor.column
          ),
          options: {
            className: "remote-cursor",
            afterContentClassName: "remote-cursor-label",
            after: {
              content: name,
              inlineClassName: "remote-cursor-name",
            },
            stickiness:
              monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        };
      })
      .filter(Boolean) as editor.IModelDeltaDecoration[];

    editorRef.deltaDecorations([], decorations);
  }, [others, editorRef]);
  const handleMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      setEditorRef(editorInstance);
      (window as any).__EDITOR__ = editorInstance;
    },
    []
  );

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-slate-400">
        Loading file…
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      theme="vs-dark"
      language={language}
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
      }}
    />
  );
}

function stringToColor(id: number) {
  const colors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#a855f7",
    "#ec4899",
  ];
  return colors[id % colors.length];
}
