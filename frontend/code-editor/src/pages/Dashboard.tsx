import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { Plus, LogIn, Folder, Hash } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Manage your projects and collaboration sessions.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="text-indigo-400" /> New Project
            </h2>
            <div className="flex gap-3">
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Project Name"
                className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
              />
              <button
                onClick={createRoom}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LogIn className="text-emerald-400" /> Join Session
            </h2>
            <div className="flex gap-3">
              <input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Room ID"
                className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500"
              />
              <button
                onClick={joinRoom}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Folder className="text-indigo-400" /> Your Projects
        </h2>

        {loading ? (
          <div className="text-slate-500">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500">
                  No projects yet. Create one above!
                </p>
              </div>
            )}

            {rooms.map((room) => (
              <motion.div
                key={room._id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/editor/${room._id}`)}
                className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Hash className="text-indigo-400" size={20} />
                  </div>
                  <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                    ID: {room._id.slice(-4)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {room.name || "Untitled Project"}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <span>Last edited recently</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
