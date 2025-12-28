import { useState } from "react";

interface TerminalProps {
  output: string;
  isRunning: boolean;
  onClose: () => void;
  input: string;
  onInputChange: (val: string) => void;
}

export default function Terminal({
  output,
  isRunning,
  onClose,
  input,
  onInputChange,
}: TerminalProps) {
  const [activeTab, setActiveTab] = useState<"output" | "input">("output");

  return (
    <div className="h-48 bg-black text-green-400 font-mono text-sm border-t border-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("output")}
            className={`text-xs font-medium px-2 py-1 rounded ${activeTab === "output" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab("input")}
            className={`text-xs font-medium px-2 py-1 rounded ${activeTab === "input" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
          >
            Input (Stdin)
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-red-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 p-3 overflow-auto">
        {activeTab === "output" ? (
          isRunning ? (
            <span className="text-yellow-400">Running…</span>
          ) : output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <span className="text-slate-500">No output</span>
          )
        ) : (
          <textarea
            className="w-full h-full bg-transparent text-white resize-none outline-none placeholder-slate-600"
            placeholder="Enter input for your program here..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
