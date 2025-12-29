import { useState } from "react";

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
      <div className="flex items-center gap-1 px-2 h-8 bg-[#252526] border-b border-[#3e3e42]">
        <button
          onClick={() => setActiveTab("output")}
          className={`px-2 py-1 text-xs ${
            activeTab === "output"
              ? "text-[#cccccc] border-b border-[#BD67E0]"
              : "text-[#858585] hover:text-[#cccccc]"
          }`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab("input")}
          className={`px-2 py-1 text-xs ${
            activeTab === "input"
              ? "text-[#cccccc] border-b border-[#BD67E0]"
              : "text-[#858585] hover:text-[#cccccc]"
          }`}
        >
          Input
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2 font-mono text-xs">
        {activeTab === "output" ? (
          isRunning ? (
            <div className="text-[#cccccc]">Running...</div>
          ) : output ? (
            <pre className="whitespace-pre-wrap text-[#cccccc]">{output}</pre>
          ) : (
            <div className="text-[#858585]">Run code to see output</div>
          )
        ) : (
          <textarea
            className="w-full h-full bg-transparent text-[#cccccc] resize-none outline-none placeholder-[#858585]"
            placeholder="Input for stdin..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
