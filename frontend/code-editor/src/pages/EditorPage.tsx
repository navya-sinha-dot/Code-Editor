import { useState, useRef, useEffect } from "react";
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
  Terminal as TermIcon,
  X,
  Copy,
  Check,
} from "lucide-react";

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

  const [fileTreeWidth, setFileTreeWidth] = useState(224);
  const [terminalHeight, setTerminalHeight] = useState(224);
  const [isDraggingFileTree, setIsDraggingFileTree] = useState(false);
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileTreeRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  const handleFileTreeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingFileTree(true);
  };

  const handleTerminalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingTerminal(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingFileTree) {
      const newWidth = e.clientX;
      if (newWidth >= 150 && newWidth <= 500) {
        setFileTreeWidth(newWidth);
      }
    }
    if (isDraggingTerminal) {
      const newHeight = window.innerHeight - e.clientY - 48;
      if (newHeight >= 100 && newHeight <= 600) {
        setTerminalHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingFileTree(false);
    setIsDraggingTerminal(false);
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    if (isDraggingFileTree || isDraggingTerminal) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingFileTree, isDraggingTerminal]);

  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <div className="flex h-[calc(100vh-48px)] bg-[#1e1e1e]">
        <div
          ref={fileTreeRef}
          style={{ width: `${fileTreeWidth}px` }}
          className="bg-[#252526] border-r border-[#3e3e42] relative"
        >
          <FileTree
            activeFileId={activeFile?._id}
            onSelectFile={setActiveFile}
          />
          <div
            onMouseDown={handleFileTreeMouseDown}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#9510C9] transition-colors"
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
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
              <button
                onClick={handleCopyRoomId}
                className="flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-[#2a2d2e] text-[#cccccc] rounded-sm"
                title="Copy Room ID"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span className="text-xs">
                  {copied ? "Copied!" : "Copy Room ID"}
                </span>
              </button>
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
                <TermIcon size={14} />
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
            <div
              ref={terminalRef}
              style={{ height: `${terminalHeight}px` }}
              className="bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col relative"
            >
              <div
                onMouseDown={handleTerminalMouseDown}
                className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-[#9510C9] transition-colors z-10"
              />
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
