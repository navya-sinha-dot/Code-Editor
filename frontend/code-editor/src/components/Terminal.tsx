interface TerminalProps {
  output: string;
  isRunning: boolean;
  onClose: () => void;
}

export default function Terminal({
  output,
  isRunning,
  onClose,
}: TerminalProps) {
  return (
    <div className="h-40 bg-black text-green-400 font-mono text-sm border-t border-slate-800">
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 text-slate-300">
        <span>Terminal</span>
        <button
          onClick={onClose}
          className="text-xs text-red-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="p-3 overflow-auto h-full">
        {isRunning ? (
          <span className="text-yellow-400">Running…</span>
        ) : output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-slate-500">No output</span>
        )}
      </div>
    </div>
  );
}
