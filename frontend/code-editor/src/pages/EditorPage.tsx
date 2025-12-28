import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import FileTree from "../components/FileTree";
import Terminal from "../components/Terminal";
import { runCode } from "../api/runcode";
import { RoomProvider } from "../../liveblocks.config";
import { getLanguageFromFileName } from "../utils/fileUtils";
import {
  Play,
  MessageSquare,
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function EditorPage() {
  const { roomId } = useParams();

  const [showChat, setShowChat] = useState(true);
  const [activeFile, setActiveFile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(200);
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

  const toggleTerminalSize = () => {
    setTerminalHeight(terminalHeight === 200 ? 400 : 200);
  };

  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <div className="flex h-[calc(100vh-48px)] bg-[#0a0a0f]">
        <div className="w-60 border-r border-[#1e1e2e] bg-[#0d0d14] flex flex-col">
          <FileTree
            activeFileId={activeFile?._id}
            onSelectFile={setActiveFile}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-10 border-b border-[#1e1e2e] flex items-center justify-between px-2 bg-[#0d0d14]">
            <div className="flex items-center gap-1">
              {activeFile && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] rounded-t-lg border-t border-l border-r border-[#2a2a3a] text-sm">
                  <span className="text-slate-300 font-mono">
                    {activeFile.name}
                  </span>
                  <button
                    onClick={() => setActiveFile(null)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning || !activeFile}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Play size={14} />
                {isRunning ? "Running..." : "Run"}
              </button>

              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${showTerminal
                  ? "bg-[#1a1a24] text-violet-400 border border-violet-500/30"
                  : "text-slate-400 hover:bg-[#1a1a24] hover:text-slate-300"
                  }`}
              >
                <TerminalIcon size={14} />
                Terminal
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${showChat
                  ? "bg-[#1a1a24] text-violet-400 border border-violet-500/30"
                  : "text-slate-400 hover:bg-[#1a1a24] hover:text-slate-300"
                  }`}
              >
                <MessageSquare size={14} />
                Chat
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
            {activeFile ? (
              <Editor key={activeFile._id} fileName={activeFile.name} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] flex items-center justify-center">
                  <TerminalIcon size={32} className="text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-400">
                    No file selected
                  </p>
                  <p className="text-sm text-slate-600">
                    Create or select a file from the explorer to start coding
                  </p>
                </div>
              </div>
            )}
          </div>

          {showTerminal && (
            <div
              className="border-t border-[#2a2a2a] bg-[#0d0d0d] flex flex-col"
              style={{ height: terminalHeight }}
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#2a2a2a]">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Terminal
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleTerminalSize}
                    className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {terminalHeight === 200 ? (
                      <Maximize2 size={14} />
                    ) : (
                      <Minimize2 size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => setShowTerminal(false)}
                    className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
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
          <div className="w-80 border-l border-[#1e1e2e] bg-[#0d0d14] flex flex-col">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </RoomProvider>
  );
}
