import { useState } from "react";
import { Terminal as TerminalIcon, Keyboard } from "lucide-react";

interface TerminalProps {
  output: string;
  isRunning: boolean;
  input: string;
  onInputChange: (val: string) => void;
}

export default function Terminal({
  output,
  isRunning,
  input,
  onInputChange,
}: TerminalProps) {
  const [activeTab, setActiveTab] = useState<"output" | "input">("output");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1 bg-[#0d0d0d] border-b border-[#2a2a2a]">
        <button
          onClick={() => setActiveTab("output")}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === "output"
            ? "bg-[#1a1a24] text-emerald-400"
            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
        >
          <TerminalIcon size={12} />
          Output
        </button>
        <button
          onClick={() => setActiveTab("input")}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === "input"
            ? "bg-[#1a1a24] text-violet-400"
            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
        >
          <Keyboard size={12} />
          Input (stdin)
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 font-mono text-sm">
        {activeTab === "output" ? (
          isRunning ? (
            <div className="flex items-center gap-2 text-amber-400">
              <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Running...
            </div>
          ) : output ? (
            <pre className="whitespace-pre-wrap text-emerald-400 leading-relaxed">
              {output}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
              <TerminalIcon size={24} />
              <span className="text-xs">Run your code to see output</span>
            </div>
          )
        ) : (
          <div className="h-full">
            <textarea
              className="w-full h-full bg-transparent text-slate-200 resize-none outline-none placeholder-slate-600 leading-relaxed"
              placeholder="Enter input for your program here...&#10;&#10;Each line will be treated as separate input."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
