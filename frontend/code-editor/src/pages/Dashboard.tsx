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
} from "lucide-react";
import { BACKEND_URL } from "../config";
import { Component as EtheralShadow } from "../components/eternal-shadows";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/rooms`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

    if (!res.ok) {
      alert("Failed to create room");
      return;
    }

    const room = await res.json();
    setRooms((prev) => [room, ...prev]);
    setNewRoomName("");
    navigate(`/editor/${room._id}`);
  };

  const joinRoom = async () => {
    if (!joinRoomId) return;

    const res = await fetch(`${BACKEND_URL}/api/rooms/${joinRoomId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      alert("Failed to join room");
      return;
    }

    navigate(`/editor/${joinRoomId}`);
  };

  const copyRoomId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
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
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Create or join collaboration sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl bg-[#12121a]/90 border border-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-violet-400" />
              New Project
            </h2>
            <div className="flex gap-3">
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
                placeholder="Project name"
                className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
              />
              <button
                onClick={createRoom}
                className="bg-[#4C1170] hover:bg-[#6B0B8F] px-4 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Create
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#12121a]/90 border border-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <LogIn size={16} className="text-violet-400" />
              Join Session
            </h2>
            <div className="flex gap-3">
              <input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Room ID"
                className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-500/50"
              />
              <button
                onClick={joinRoom}
                className="bg-[#4C1170] hover:bg-[#6B0B8F] px-4 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Join
                <Users size={14} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-md font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Folder size={16} className="text-violet-400" />
            Your Projects
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Loading projects…
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
                  className="group cursor-pointer rounded-xl bg-[#12121a]/90 border border-white/5 p-5 hover:border-violet-500/30 transition backdrop-blur"
                >
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={(e) => copyRoomId(room._id, e)}
                      className="text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedId === room._id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          {room._id.slice(-6)}
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-medium text-slate-200 mb-2 group-hover:text-white">
                    {room.name || "Untitled Project"}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock size={12} />
                    Recently updated
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
