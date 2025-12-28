import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFiles, createFile, deleteFile } from "../api/file";
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  FilePlus,
  FolderPlus,
} from "lucide-react";

interface FileItem {
  _id: string;
  name: string;
  isFolder?: boolean;
  parentId?: string | null;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode size={16} className="text-blue-400" />;
    case "json":
      return <FileJson size={16} className="text-yellow-400" />;
    case "py":
      return <FileCode size={16} className="text-green-400" />;
    case "cpp":
    case "c":
    case "h":
      return <FileCode size={16} className="text-purple-400" />;
    case "java":
      return <FileCode size={16} className="text-orange-400" />;
    case "html":
    case "css":
      return <FileCode size={16} className="text-pink-400" />;
    case "md":
      return <FileText size={16} className="text-slate-400" />;
    default:
      return <File size={16} className="text-slate-500" />;
  }
};

export default function FileTree({ activeFileId, onSelectFile }: any) {
  const { roomId } = useParams();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    fetchFiles(roomId).then((res) => {
      setFiles(res.data);
      setLoading(false);
    });
  }, [roomId]);

  const handleCreateFile = async (parentId: string | null = null) => {
    if (!roomId || !newItemName.trim()) return;

    const name = parentId
      ? `${files.find((f) => f._id === parentId)?.name}/${newItemName}`
      : newItemName;
    const language = newItemName.split(".").pop() || "plaintext";

    const res = await createFile({
      roomId,
      name: newItemName,
      language,
      content: "",
      parentId,
    });

    setFiles((prev) => [...prev, res.data]);
    onSelectFile(res.data);
    setShowNewFileInput(false);
    setNewItemName("");
    setNewItemParentId(null);
  };

  const handleCreateFolder = async (parentId: string | null = null) => {
    if (!roomId || !newItemName.trim()) return;

    const res = await createFile({
      roomId,
      name: newItemName,
      isFolder: true,
      parentId,
    });

    setFiles((prev) => [...prev, { ...res.data, isFolder: true }]);
    setShowNewFolderInput(false);
    setNewItemName("");
    setNewItemParentId(null);
  };

  const handleDeleteFile = async (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${file.name}"?`)) return;

    await deleteFile(file._id);
    setFiles((prev) => prev.filter((f) => f._id !== file._id));

    if (activeFileId === file._id) {
      onSelectFile(null);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const startNewFile = (parentId: string | null = null) => {
    setShowNewFileInput(true);
    setShowNewFolderInput(false);
    setNewItemParentId(parentId);
    setNewItemName("");
  };

  const startNewFolder = (parentId: string | null = null) => {
    setShowNewFolderInput(true);
    setShowNewFileInput(false);
    setNewItemParentId(parentId);
    setNewItemName("");
  };

  if (loading) {
    return (
      <div className="p-4 text-slate-500 text-sm flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-slate-600 border-t-violet-500 rounded-full animate-spin" />
        Loading...
      </div>
    );
  }

  const rootFiles = files.filter((f) => !f.parentId);
  const getChildren = (parentId: string) =>
    files.filter((f) => f.parentId === parentId);

  const renderFileItem = (file: FileItem, depth: number = 0) => {
    const isFolder = file.isFolder;
    const isExpanded = expandedFolders.has(file._id);
    const children = getChildren(file._id);

    return (
      <div key={file._id}>
        <div
          onClick={() =>
            isFolder ? toggleFolder(file._id) : onSelectFile(file)
          }
          className={`group flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors ${
            activeFileId === file._id
              ? "bg-violet-500/15 text-violet-300"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown size={14} className="text-slate-500" />
              ) : (
                <ChevronRight size={14} className="text-slate-500" />
              )}
              {isExpanded ? (
                <FolderOpen size={16} className="text-violet-400" />
              ) : (
                <Folder size={16} className="text-violet-400" />
              )}
            </>
          ) : (
            <>
              <span className="w-[14px]" />
              {getFileIcon(file.name)}
            </>
          )}

          <span className="flex-1 text-sm font-mono truncate">{file.name}</span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewFile(file._id);
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                  title="New File"
                >
                  <FilePlus size={12} className="text-slate-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewFolder(file._id);
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                  title="New Folder"
                >
                  <FolderPlus size={12} className="text-slate-500" />
                </button>
              </>
            )}
            <button
              onClick={(e) => handleDeleteFile(file, e)}
              className="p-1 hover:bg-red-500/20 rounded"
              title="Delete"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        </div>

        {isFolder && isExpanded && (
          <div>{children.map((child) => renderFileItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d14] text-slate-300">
      <div className="h-10 flex items-center justify-between px-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => startNewFile(null)}
            className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded transition-colors"
            title="New File"
          >
            <FilePlus size={16} />
          </button>
          <button
            onClick={() => startNewFolder(null)}
            className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded transition-colors"
            title="New Folder"
          >
            <FolderPlus size={16} />
          </button>
        </div>
      </div>

      {(showNewFileInput || showNewFolderInput) && (
        <div className="px-3 py-2 border-b border-[#1e1e2e] bg-[#0a0a0f]">
          <div className="flex items-center gap-2">
            {showNewFileInput ? (
              <File size={14} className="text-slate-500" />
            ) : (
              <Folder size={14} className="text-violet-400" />
            )}
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  showNewFileInput
                    ? handleCreateFile(newItemParentId)
                    : handleCreateFolder(newItemParentId);
                } else if (e.key === "Escape") {
                  setShowNewFileInput(false);
                  setShowNewFolderInput(false);
                  setNewItemName("");
                }
              }}
              placeholder={showNewFileInput ? "filename.ext" : "folder name"}
              className="flex-1 bg-[#1a1a24] border border-violet-500/30 rounded px-2 py-1 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto py-2">
        {files.length === 0 && !showNewFileInput && !showNewFolderInput ? (
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#1a1a24] flex items-center justify-center">
              <Folder size={24} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 mb-3">No files yet</p>
            <button
              onClick={() => startNewFile(null)}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Create your first file
            </button>
          </div>
        ) : (
          rootFiles.map((file) => renderFileItem(file))
        )}
      </div>
    </div>
  );
}
