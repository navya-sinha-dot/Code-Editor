import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFiles, createFile, deleteFile } from "../api/file";

export default function FileTree({ activeFileId, onSelectFile }: any) {
  const { roomId } = useParams();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    fetchFiles(roomId).then((res) => {
      setFiles(res.data);
      setLoading(false);
    });
  }, [roomId]);

  const handleCreateFile = async () => {
    if (!roomId) return;

    const name = prompt("Enter file name (with extension)");
    if (!name) return;

    const language = name.split(".").pop() || "plaintext";

    const res = await createFile({
      roomId,
      name,
      language,
      content: "",
    });

    setFiles((prev) => [...prev, res.data]);
    onSelectFile(res.data);
  };

  const handleDeleteFile = async (file: any) => {
    await deleteFile(file._id);

    setFiles((prev) => prev.filter((f) => f._id !== file._id));

    if (activeFileId === file._id) {
      onSelectFile(null);
    }
  };

  if (loading) {
    return <div className="p-4 text-slate-500">Loading files...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300">
      <div className="h-12 flex items-center justify-between px-4 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase">
          Explorer
        </span>
        <button onClick={handleCreateFile}>＋</button>
      </div>

      <div className="flex-1 overflow-auto">
        {files.map((file) => (
          <div
            key={file._id}
            onClick={() => onSelectFile(file)}
            className={`px-4 py-2 cursor-pointer flex justify-between
              ${
                activeFileId === file._id
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "hover:bg-slate-800"
              }
            `}
          >
            <span>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file);
              }}
              className="text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
