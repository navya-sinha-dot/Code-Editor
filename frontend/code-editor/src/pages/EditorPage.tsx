import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import FileTree from "../components/FileTree";
import Terminal from "../components/Terminal";
import { runCode } from "../api/runcode";
import { RoomProvider } from "../../liveblocks.config";
import { getLanguageFromFileName } from "../utils/fileUtils";
import { Play, MessageSquare, Terminal as TerminalIcon, X } from "lucide-react";

export default function EditorPage() {
  const { roomId } = useParams();

  const [showChat, setShowChat] = useState(true);
  const [activeFile, setActiveFile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  const [showTerminal, setShowTerminal] = useState(true);
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
      <div className="flex h-[calc(100vh-48px)] bg-[#1e1e1e]">
        <div className="w-56 bg-[#252526] border-r border-[#3e3e42]">
          <FileTree
            activeFileId={activeFile?._id}
            onSelectFile={setActiveFile}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-3">
            <div className="flex items-center gap-1">
              {activeFile && (
                <div className="flex items-center gap-2 px-2 py-1 text-sm text-[#cccccc] bg-[#1e1e1e]">
                  <span className="text-xs">{activeFile.name}</span>
                  <button
                    onClick={() => setActiveFile(null)}
                    className="text-[#858585] hover:text-[#cccccc]"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleRun}
                disabled={isRunning || !activeFile}
                className="flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-[#6B0B8F] bg-[#480663] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-sm"
              >
                <Play size={12} />
                {isRunning ? "Running" : "Run"}
              </button>

              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-1.5 rounded-sm ${
                  showTerminal
                    ? "bg-[#37373d] text-[#cccccc]"
                    : "text-[#858585] hover:bg-[#2a2d2e]"
                }`}
              >
                <TerminalIcon size={14} />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-1.5 rounded-sm ${
                  showChat
                    ? "bg-[#37373d] text-[#cccccc]"
                    : "text-[#858585] hover:bg-[#2a2d2e]"
                }`}
              >
                <MessageSquare size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <Editor key={activeFile._id} fileName={activeFile.name} />
            ) : (
              <div className="flex items-center justify-center h-full text-[#858585] text-sm">
                No file selected
              </div>
            )}
          </div>

          {showTerminal && (
            <div className="h-56 bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col">
              <div className="flex items-center justify-between h-9 px-3 bg-[#252526]">
                <span className="text-xs text-[#cccccc]">Terminal</span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-[#858585] hover:text-[#cccccc]"
                >
                  <X size={12} />
                </button>
              </div>
              <Terminal
                output={terminalOutput}
                isRunning={isRunning}
                input={stdin}
                onInputChange={setStdin}
              />
            </div>
          )}
        </div>

        {showChat && (
          <div className="w-80 bg-[#252526] border-l border-[#3e3e42]">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </RoomProvider>
  );
}
