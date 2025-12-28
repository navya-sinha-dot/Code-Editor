import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import FileTree from "../components/FileTree";
import Terminal from "../components/Terminal";
import { runCode } from "../api/runcode";
import { RoomProvider } from "../../liveblocks.config";

const DEFAULT_LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  cpp: "cpp",
};

export default function EditorPage() {
  const { roomId } = useParams();

  const [showChat, setShowChat] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>("index.ts");

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  if (!roomId) return null;

  const getLanguageFromFile = (fileId: string) => {
    const ext = fileId.split(".").pop() || "ts";
    return DEFAULT_LANGUAGE_MAP[ext] || "plaintext";
  };

  const handleRun = async () => {
    try {
      const editor = (window as any).__EDITOR__;
      if (!editor || !activeFileId) return;

      setIsRunning(true);
      setShowTerminal(true);
      setTerminalOutput("");

      const code = editor.getValue();
      const language = getLanguageFromFile(activeFileId);

      const result = await runCode(code, language);

      setTerminalOutput(
        result.stdout || result.stderr || result.compile_output || "No output"
      );
    } catch {
      setTerminalOutput("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <div className="flex h-screen">
        <div className="w-64 border-r border-slate-800 bg-slate-900 overflow-y-auto">
          <FileTree
            activeFileId={activeFileId}
            onSelectFile={setActiveFileId}
          />
        </div>

        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
            <span className="text-sm text-slate-400 font-mono">
              {activeFileId ?? "No file selected"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded"
              >
                ▶ Run
              </button>

              <button
                onClick={() => setShowChat((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
              >
                {showChat ? "Hide Chat" : "Chat"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeFileId ? (
              <Editor
                key={activeFileId}
                language={getLanguageFromFile(activeFileId)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Select a file to edit
              </div>
            )}
          </div>

          {showTerminal && (
            <Terminal
              output={terminalOutput}
              isRunning={isRunning}
              onClose={() => setShowTerminal(false)}
            />
          )}
        </div>

        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </RoomProvider>
  );
}
