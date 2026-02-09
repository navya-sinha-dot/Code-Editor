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
} from "lucide-react";
import { BACKEND_URL } from "../config";
import { Component as EtheralShadow } from "../components/eternal-shadows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [leaveModalRoom, setLeaveModalRoom] = useState<any | null>(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState<any | null>(null);

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
    if (!leaveModalRoom) return;
    await fetch(`${BACKEND_URL}/api/rooms/${leaveModalRoom._id}/leave`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setRooms((prev) => prev.filter((r) => r._id !== leaveModalRoom._id));
    setLeaveModalRoom(null);
  };

  const confirmDelete = async () => {
    if (!deleteModalRoom) return;
    await fetch(`${BACKEND_URL}/api/rooms/${deleteModalRoom._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setRooms((prev) => prev.filter((r) => r._id !== deleteModalRoom._id));
    setDeleteModalRoom(null);
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
            <Card className="border-white/5 bg-[#12121a]/90">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <Plus size={16} /> New Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createRoom()}
                    placeholder="Project name"
                    className="flex-1"
                  />
                  <Button
                    onClick={createRoom}
                    className="bg-[#4C1170] hover:bg-[#5a1d82]"
                  >
                    Create <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#12121a]/90">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <LogIn size={16} /> Join Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                    placeholder="Room ID"
                    className="flex-1 font-mono"
                  />
                  <Button
                    onClick={joinRoom}
                    className="bg-[#4C1170] hover:bg-[#5a1d82]"
                  >
                    Join <Users className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                <Card
                  key={room._id}
                  onClick={() => navigate(`/editor/${room._id}`)}
                  className="cursor-pointer group hover:border-violet-500/50 transition-colors bg-[#12121a]/90 border-white/5"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => copyRoomId(room._id, e)}
                        className="h-6 px-2 text-xs font-mono text-slate-500 hover:text-white"
                      >
                        {copiedId === room._id ? (
                          <>
                            <Check className="mr-1 h-3 w-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" /> {room._id.slice(-6)}
                          </>
                        )}
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeaveModalRoom(room);
                          }}
                          className="h-7 w-7 text-slate-400 hover:text-white"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>

                        {room.role === "OWNER" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModalRoom(room);
                            }}
                            className="h-7 w-7 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-slate-200 font-medium group-hover:text-violet-400 transition-colors mb-1">
                      {room.name || "Untitled Project"}
                    </h3>

                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Recently updated
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!leaveModalRoom} onOpenChange={() => setLeaveModalRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{leaveModalRoom?.name}"? You will need to join again via room ID.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave} className="bg-violet-600 hover:bg-violet-700">
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteModalRoom} onOpenChange={() => setDeleteModalRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{deleteModalRoom?.name}" and all its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
