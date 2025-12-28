import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import FileTree from "../components/FileTree";
import Terminal from "../components/Terminal";
import { runCode } from "../api/runcode";
import { RoomProvider } from "../../liveblocks.config";
import { getLanguageFromFileName } from "../utils/fileUtils";

export default function EditorPage() {
  const { roomId } = useParams();

  const [showChat, setShowChat] = useState(false);
  const [activeFile, setActiveFile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  if (!roomId) return null;

  const handleRun = async () => {
    try {
      const editor = (window as any).__EDITOR__;
      if (!editor || !activeFile) return;

      setIsRunning(true);
      setShowTerminal(true);
      setTerminalOutput("");

      const code = editor.getValue();
      const language = getLanguageFromFileName(activeFile.name);

      const result = await runCode(code, language, stdin);

      setTerminalOutput(
        result.stdout ||
          result.stderr ||
          result.compile_output ||
          result.status ||
          "No output"
      );
    } catch (err: any) {
      setTerminalOutput(
        err?.response?.data?.error ||
          err?.message ||
          JSON.stringify(err, null, 2)
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <div className="flex h-screen">
        <div className="w-64 border-r border-slate-800 bg-slate-900 overflow-y-auto">
          <FileTree
            activeFileId={activeFile?._id}
            onSelectFile={setActiveFile}
          />
        </div>

        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
            <span className="text-sm text-slate-400 font-mono">
              {activeFile?.name ?? "No file selected"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning || !activeFile}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded"
              >
                ▶ Run
              </button>

              <button
                onClick={() => setShowChat((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                {showChat ? "Hide Chat" : "Chat"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeFile ? (
              <Editor key={activeFile._id} fileName={activeFile.name} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Create or select a file to start coding
              </div>
            )}
          </div>

          {showTerminal && (
            <Terminal
              output={terminalOutput}
              isRunning={isRunning}
              input={stdin}
              onInputChange={setStdin}
              onClose={() => setShowTerminal(false)}
            />
          )}
        </div>
        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </RoomProvider>
  );
}
