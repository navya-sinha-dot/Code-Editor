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
  X,
} from "lucide-react";

interface FileItem {
  _id: string;
  name: string;
  type: "FILE" | "FOLDER";
  parentId?: string | null;
}

export default function FileTree({ activeFileId, onSelectFile }: any) {
  const { roomId } = useParams();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [deleteModal, setDeleteModal] = useState<FileItem | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<"FILE" | "FOLDER">("FILE");

  useEffect(() => {
    if (!roomId) return;

    fetchFiles(roomId).then((res) => {
      setFiles(res.data);
      setLoading(false);
    });
  }, [roomId]);

  const handleCreateFile = async () => {
    if (!roomId || !newItemName.trim()) return;

    const isFolder = createType === "FOLDER";

    const language = isFolder
      ? undefined
      : newItemName.split(".").pop() || "plaintext";

    const res = await createFile({
      roomId,
      name: newItemName,
      type: isFolder ? "FOLDER" : "FILE",
      content: isFolder ? undefined : "",
      parentId: currentFolderId,
      language,
    });

    setFiles((prev) => [...prev, res.data]);

    if (!isFolder) {
      onSelectFile(res.data);
    }

    setShowNewFileInput(false);
    setNewItemName("");
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    await deleteFile(deleteModal._id);
    setFiles((prev) => prev.filter((f) => f._id !== deleteModal._id));

    if (activeFileId === deleteModal._id) {
      onSelectFile(null);
    }

    setDeleteModal(null);
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

  if (loading) {
    return <div className="p-3 text-[#858585] text-xs">Loading...</div>;
  }

  const rootFiles = files.filter((f) => !f.parentId);
  const getChildren = (parentId: string) =>
    files.filter((f) => f.parentId === parentId);

  const renderFileItem = (file: FileItem, depth: number = 0) => {
    const isFolder = file.type == "FOLDER";
    const isExpanded = expandedFolders.has(file._id);
    const children = getChildren(file._id);

    return (
      <div key={file._id}>
        <div
          onClick={() => {
            if (isFolder) {
              toggleFolder(file._id);
              setCurrentFolderId(file._id);
            } else {
              onSelectFile(file);
            }
          }}
          className={`group flex items-center gap-1.5 px-2 py-1 cursor-pointer ${
            activeFileId === file._id ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown size={14} className="text-[#858585]" />
              ) : (
                <ChevronRight size={14} className="text-[#858585]" />
              )}
              {isExpanded ? (
                <FolderOpen size={16} className="text-[#dcb67a]" />
              ) : (
                <Folder size={16} className="text-[#dcb67a]" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <File size={16} className="text-[#858585]" />
            </>
          )}

          <span className="flex-1 text-sm text-[#cccccc] truncate">
            {file.name}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal(file);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#3e3e42] rounded-sm"
          >
            <Trash2 size={12} className="text-[#858585]" />
          </button>
        </div>

        {isFolder && isExpanded && (
          <div>{children.map((child) => renderFileItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="h-9 flex items-center justify-between px-2 border-b border-[#3e3e42]">
          <span className="text-xs text-[#cccccc] uppercase">Explorer</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCreateType("FILE");
                setShowNewFileInput(true);
              }}
              className="p-1 text-[#858585] hover:bg-[#2a2d2e] rounded-sm"
              title="New File"
            >
              <File size={14} />
            </button>

            <button
              onClick={() => {
                setCreateType("FOLDER");
                setShowNewFileInput(true);
              }}
              className="p-1 text-[#858585] hover:bg-[#2a2d2e] rounded-sm"
              title="New Folder"
            >
              <Folder size={14} />
            </button>
          </div>
        </div>

        {showNewFileInput && (
          <div className="px-2 py-1 border-b border-[#3e3e42]">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFile();
                } else if (e.key === "Escape") {
                  setShowNewFileInput(false);
                  setNewItemName("");
                }
              }}
              placeholder={
                createType === "FOLDER" ? "folder-name" : "filename.ext"
              }
              className="w-full px-2 py-1 bg-[#3c3c3c] border border-[#007acc] rounded-sm text-xs text-[#cccccc] placeholder-[#858585] focus:outline-none"
              autoFocus
            />
          </div>
        )}

        <div className="flex-1 overflow-auto py-1">
          {files.length === 0 && !showNewFileInput ? (
            <div className="px-3 py-8 text-center text-xs text-[#858585]">
              No files yet
            </div>
          ) : (
            rootFiles.map((file) => renderFileItem(file))
          )}
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={() => setDeleteModal(null)}
          />
          <div className="relative bg-[#252526] border border-[#3e3e42] rounded-2xl shadow-xl w-96">
            <div className="flex items-center justify-between p-4 ">
              <h3 className="text-xl font-medium text-[#cccccc]">
                Delete File
              </h3>
              <button
                onClick={() => setDeleteModal(null)}
                className=" cursor:pointer text-[#858585] hover:text-[#cccccc]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-3">
              <p className="text-md text-[#cccccc] mb-1">
                Are you sure you want to delete this file?
              </p>
              <p className="text-sm text-[#858585] font-mono">
                {deleteModal.name}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-[#3e3e42]">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#2a2d2e] rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs hover:bg-[#6B0B8F] bg-[#480663] text-white rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
