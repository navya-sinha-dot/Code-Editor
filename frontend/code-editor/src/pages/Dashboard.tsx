import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import {
  Plus,
  LogIn,
  Folder,
  Hash,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/rooms", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    const res = await fetch("http://localhost:3000/api/rooms", {
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

    const res = await fetch(
      `http://localhost:3000/api/rooms/${joinRoomId}/join`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

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
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 pt-20">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Sparkles size={24} className="text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            <p className="text-slate-500">
              Manage your projects and collaboration sessions.
            </p>
          </motion.div>
        </header>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Plus className="text-violet-400" size={20} />
              </div>
              New Project
            </h2>
            <div className="flex gap-3">
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
                placeholder="Project Name"
                className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-slate-600 transition-all"
              />
              <button
                onClick={createRoom}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                Create
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <LogIn className="text-emerald-400" size={20} />
              </div>
              Join Session
            </h2>
            <div className="flex gap-3">
              <input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Paste Room ID"
                className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder-slate-600 font-mono transition-all"
              />
              <button
                onClick={joinRoom}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                Join
                <Users size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Folder className="text-violet-400" size={20} />
            Your Projects
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500 gap-3">
              <div className="w-5 h-5 border-2 border-slate-600 border-t-violet-500 rounded-full animate-spin" />
              Loading projects...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.length === 0 && (
                <div className="col-span-full py-16 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1a1a24] flex items-center justify-center">
                    <Folder size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 mb-1">No projects yet</p>
                  <p className="text-sm text-slate-600">
                    Create your first project above to get started
                  </p>
                </div>
              )}

              {rooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/editor/${room._id}`)}
                  className="group p-5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                      <Hash className="text-violet-400" size={18} />
                    </div>
                    <button
                      onClick={(e) => copyRoomId(room._id, e)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 bg-[#1a1a24] hover:bg-[#2a2a3a] rounded-lg font-mono transition-colors"
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
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors mb-2">
                    {room.name || "Untitled Project"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock size={12} />
                    <span>Last edited recently</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
