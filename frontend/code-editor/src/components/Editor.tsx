import { useCallback, useEffect, useRef, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom, useMyPresence, useOthers } from "../../liveblocks.config";
import type { editor } from "monaco-editor";
import axios from "axios";
import * as monaco from "monaco-editor";
import { getToken } from "../utils/token";
import { getLanguageFromFileName } from "../utils/fileUtils";

interface EditorProps {
  fileName: string;
}

export default function Editor({ fileName }: EditorProps) {
  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);

  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [ready, setReady] = useState(false);

  const hydratedRef = useRef(false);

  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const fileLanguage = getLanguageFromFileName(fileName);

  useEffect(() => {
    if (!room || !fileName || hydratedRef.current) return;

    const roomId = room.id;
    const yText = yProvider.getYDoc().getText(`file:${fileName}`);
    const token = getToken();

    if (!token) {
      setReady(true);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/files/${roomId}/file/${fileName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.content && yText.length === 0) {
          yText.insert(0, res.data.content);
        }
      } catch (e) {
        console.error("Load failed");
      } finally {
        hydratedRef.current = true;
        setReady(true);
      }
    })();
  }, [room, fileName, yProvider]);

  useEffect(() => {
    if (!editorRef || !ready) return;

    const yText = yProvider.getYDoc().getText(`file:${fileName}`);

    const binding = new MonacoBinding(
      yText,
      editorRef.getModel()!,
      new Set([editorRef]),
      yProvider.awareness as any
    );

    const model = editorRef.getModel();
    if (model) {
      model.setValue(model.getValue());
    }

    return () => binding.destroy();
  }, [editorRef, ready, fileName, yProvider]);

  useEffect(() => {
    if (!room || !editorRef || !ready) return;

    const roomId = room.id;
    const token = getToken();
    if (!token) return;

    const interval = setInterval(() => {
      axios.post(
        `http://localhost:3000/api/files/${roomId}/file/${fileName}`,
        {
          content: editorRef.getValue(),
          language: fileLanguage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [room, editorRef, ready, fileName, fileLanguage]);

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

        return {
          range: new monaco.Range(
            cursor.lineNumber,
            cursor.column,
            cursor.lineNumber,
            cursor.column
          ),
          options: {
            className: "remote-cursor",
            after: {
              content: other.info?.name ?? "User",
              inlineClassName: "remote-cursor-name",
            },
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
      const model = editorInstance.getModel();
      if (model) {
        model.setValue(model.getValue());
      }
    },
    []
  );

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading file…
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      theme="vs-dark"
      language={fileLanguage}
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
}
