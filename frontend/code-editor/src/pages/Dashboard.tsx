import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import {
  Plus,
  LogIn,
  Folder,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Trash2,
  LogOut,
  X,
} from "lucide-react";
import { BACKEND_URL } from "../config";
import { Component as EtheralShadow } from "../components/eternal-shadows";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [leaveModal, setLeaveModal] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BACKEND_URL}/api/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [navigate]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    const res = await fetch(`${BACKEND_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ name: newRoomName }),
    });

    if (!res.ok) return alert("Failed to create room");

    const room = await res.json();
    setRooms((prev) => [room, ...prev]);
    setNewRoomName("");
    navigate(`/editor/${room._id}`);
  };

  const joinRoom = async () => {
    if (!joinRoomId) return;

    const res = await fetch(`${BACKEND_URL}/api/rooms/${joinRoomId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) return alert("Failed to join room");
    navigate(`/editor/${joinRoomId}`);
  };

  const confirmLeave = async () => {
    await fetch(`${BACKEND_URL}/api/rooms/${leaveModal._id}/leave`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setRooms((prev) => prev.filter((r) => r._id !== leaveModal._id));
    setLeaveModal(null);
  };

  const confirmDelete = async () => {
    await fetch(`${BACKEND_URL}/api/rooms/${deleteModal._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setRooms((prev) => prev.filter((r) => r._id !== deleteModal._id));
    setDeleteModal(null);
  };

  const copyRoomId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      <div className="relative min-h-screen text-slate-100 pt-20 overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <EtheralShadow
            color="rgba(120, 80, 200, 1)"
            animation={{ scale: 40, speed: 30 }}
            noise={{ opacity: 0.3, scale: 1 }}
            sizing="fill"
          />
          <div className="absolute inset-0 bg-[#0a0a0f]/65" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-violet-400" size={22} />
              <h1 className="text-3xl font-semibold">Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm">
              Create or join collaboration sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl bg-[#12121a]/90 p-6">
              <h2 className="text-sm text-slate-300 mb-4 flex items-center gap-2">
                <Plus size={16} /> New Project
              </h2>
              <div className="flex gap-3">
                <input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createRoom()}
                  placeholder="Project name"
                  className="flex-1 bg-[#1a1a24] rounded-lg px-4 py-2.5"
                />
                <button
                  onClick={createRoom}
                  className="bg-[#4C1170] px-4 rounded-lg flex items-center gap-2"
                >
                  Create <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[#12121a]/90 p-6">
              <h2 className="text-sm text-slate-300 mb-4 flex items-center gap-2">
                <LogIn size={16} /> Join Session
              </h2>
              <div className="flex gap-3">
                <input
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                  placeholder="Room ID"
                  className="flex-1 bg-[#1a1a24] rounded-lg px-4 py-2.5 font-mono"
                />
                <button
                  onClick={joinRoom}
                  className="bg-[#4C1170] px-4 rounded-lg flex items-center gap-2"
                >
                  Join <Users size={14} />
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-md text-slate-400 mb-4 flex items-center gap-2">
            <Folder size={16} /> Your Projects
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden h-32 rounded-xl bg-[#12121a]/90"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.length === 0 && (
                <div className="col-span-full py-14 text-center border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">
                  No projects yet
                </div>
              )}

              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => navigate(`/editor/${room._id}`)}
                  className="cursor-default rounded-xl bg-[#12121a]/90 p-5"
                >
                  <div className="flex justify-between mb-3">
                    <button
                      onClick={(e) => copyRoomId(room._id, e)}
                      className="text-xs font-mono text-slate-500 flex gap-1 cursor-pointer"
                    >
                      {copiedId === room._id ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> {room._id.slice(-6)}
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeaveModal(room);
                        }}
                        className="cursor-pointer"
                      >
                        <LogOut size={14} />
                      </button>

                      {room.role === "OWNER" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal(room);
                          }}
                          className="cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-slate-200 font-medium">
                    {room.name || "Untitled Project"}
                  </h3>

                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <Clock size={12} /> Recently updated
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {leaveModal && (
        <ConfirmModal
          title="Leave Room"
          text={`Leave "${leaveModal.name}"?`}
          confirmText="Leave"
          onCancel={() => setLeaveModal(null)}
          onConfirm={confirmLeave}
        />
      )}

      {deleteModal && (
        <ConfirmModal
          title="Delete Room"
          text={`Delete "${deleteModal.name}" permanently?`}
          confirmText="Delete"
          danger
          onCancel={() => setDeleteModal(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

function ConfirmModal({
  title,
  text,
  confirmText,
  onCancel,
  onConfirm,
  danger,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-[#252526] border border-[#3e3e42] rounded-2xl w-96">
        <div className="flex justify-between p-4">
          <h3 className="text-lg text-[#cccccc]">{title}</h3>
          <button onClick={onCancel} className="cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="px-4 pb-2 text-sm text-[#cccccc]">{text}</div>
        <div className="flex justify-end gap-2 p-4 border-t border-[#3e3e42]">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 text-xs rounded-sm text-white cursor-pointer ${
              danger ? "bg-[#480663]" : "bg-[#480663]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
