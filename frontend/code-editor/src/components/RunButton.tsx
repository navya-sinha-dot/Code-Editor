interface RunButtonProps {
  onRun: () => void;
  disabled: boolean;
}

export default function RunButton({ onRun, disabled }: RunButtonProps) {
  return (
    <button
      onClick={onRun}
      disabled={disabled}
      className={`px-4 py-1.5 text-sm font-medium rounded
        ${
          disabled
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }
        text-white transition`}
    >
      ▶ Run
    </button>
  );
}
