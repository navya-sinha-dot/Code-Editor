import { useState } from "react";

interface FileTreeProps {
  activeFileId: string | null;
  onSelectFile: (fileId: string | null) => void;
}

export default function FileTree({
  activeFileId,
  onSelectFile,
}: FileTreeProps) {
  const [files, setFiles] = useState<string[]>([
    "index.ts",
    "app.ts",
    "utils.ts",
  ]);

  const createFile = () => {
    const fileName = prompt("Enter file name (with extension)");
    if (!fileName) return;

    setFiles((prev) => [...prev, fileName]);
    onSelectFile(fileName);
  };

  const deleteFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f !== fileName));
    if (activeFileId === fileName) {
      onSelectFile(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300">
      <div className="h-12 flex items-center justify-between px-4 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Explorer
        </span>
        <button
          onClick={createFile}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          title="New File"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {files.map((file) => (
          <div
            key={file}
            onClick={() => onSelectFile(file)}
            className={`px-4 py-2 cursor-pointer flex items-center justify-between group transition-colors
              ${
                activeFileId === file
                  ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
                  : "hover:bg-slate-800 border-l-2 border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70 flex-shrink-0"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm truncate">{file}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(file);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
