import { useEffect, useRef, useState, useMemo } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Send, Users, MessageSquare, User, X } from "lucide-react";
import { getToken } from "../utils/token";
import { BACKEND_URL } from "../config";
import { useOthers } from "../../liveblocks.config";

interface ChatMessage {
  userId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface Participant {
  userId: string;
  name: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
}

const getCurrentUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || null;
  } catch {
    return null;
  }
};

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = getCurrentUserId();


  const others = useOthers();

  const onlineUserIds = useMemo(() => {
    const ids = new Set<string>();
    if (currentUserId) {
      ids.add(currentUserId);
    }
    others.forEach((other) => {
      if (other.connectionId && other.id) {

        ids.add(other.id);
      }
    });
    return ids;
  }, [others, currentUserId]);

  const { send, isReady } = useWebSocket((data) => {
    if (data.type === "chat:history") {
      setMessages(data.payload.messages);
    }

    if (data.type === "chat:receive") {
      setMessages((prev) => [...prev, data.payload]);
    }

    if (data.type === "room:participants") {
      setParticipants(data.payload.participants);
    }
  });

  useEffect(() => {
    if (!isReady) return;

    send({ type: "room:join", payload: { roomId } });

    return () => {
      send({ type: "room:leave", payload: { roomId } });
    };
  }, [isReady, roomId]);

  useEffect(() => {
    if (!isReady) return;

    const fetchParticipants = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/rooms/${roomId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setParticipants(data.participants);
    };

    fetchParticipants();
  }, [isReady, roomId]);

  useEffect(() => {
    if (activeTab === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const sendMessage = () => {
    if (!text.trim() || !isReady) return;

    send({
      type: "chat:send",
      payload: { roomId, text },
    });

    setText("");
  };

  const removeParticipant = async (userId: string) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/rooms/${roomId}/remove/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data.participants) {
        setParticipants(data.participants);
      }
    } catch {
      console.error("Failed to remove participant");
    }
  };

  const isOwner =
    participants.find((p) => p.userId === currentUserId)?.role === "OWNER";

  return (
    <div className="flex flex-col h-full">
      <div className="h-9 flex items-center px-2 border-b border-[#3e3e42] bg-[#252526]">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-sm ${activeTab === "chat"
            ? "bg-[#37373d] text-white"
            : "text-[#cccccc] hover:bg-[#2d2d30]"
            }`}
        >
          <MessageSquare size={12} />
          Chat
        </button>

        <button
          onClick={() => setActiveTab("participants")}
          className={`ml-1 flex items-center gap-1 px-2 py-1 text-xs rounded-sm ${activeTab === "participants"
            ? "bg-[#37373d] text-white"
            : "text-[#cccccc] hover:bg-[#2d2d30]"
            }`}
        >
          <Users size={12} />
          Participants
        </button>
      </div>

      {activeTab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {messages.map((m, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-medium text-[#cccccc]">
                    {m.senderName}
                  </span>
                  <span className="text-[10px] text-[#858585]">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-xs text-[#cccccc]">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 border-t border-[#3e3e42]">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-2 py-1.5 bg-[#3c3c3c] border border-[#3e3e42] rounded-sm text-xs text-[#cccccc]"
              />
              <button
                onClick={sendMessage}
                className="px-3 py-1.5 bg-[#480663] hover:bg-[#6B0B8F] text-white rounded-sm"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === "participants" && (
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {participants.map((p) => {
            const isOnline = onlineUserIds.has(p.userId);
            return (
              <div
                key={p.userId}
                className="flex items-center justify-between py-1.5 text-xs text-[#cccccc]"
              >
                <div className="flex items-center gap-2">
                  {/* Online/Offline status indicator */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOnline
                      ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                      : "bg-gray-500"
                      }`}
                    title={isOnline ? "Online" : "Offline"}
                  />
                  <User size={14} className="text-[#9cdcfe]" />
                  <span className={isOnline ? "text-[#cccccc]" : "text-[#858585]"}>
                    {p.name}
                  </span>
                  {p.role === "OWNER" && (
                    <span className="ml-1 text-[10px] text-yellow-400">
                      (Owner)
                    </span>
                  )}
                </div>

                {isOwner && p.userId !== currentUserId && (
                  <button
                    onClick={() => removeParticipant(p.userId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
