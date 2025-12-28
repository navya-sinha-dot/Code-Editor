import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Send, MessageCircle } from "lucide-react";

interface ChatMessage {
  userId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { send, isReady } = useWebSocket((data) => {
    if (data.type === "chat:history") {
      setMessages(data.payload.messages);
    }

    if (data.type === "chat:receive") {
      setMessages((prev) => [...prev, data.payload]);
    }
  });

  useEffect(() => {
    if (!isReady) return;

    send({
      type: "room:join",
      payload: { roomId },
    });

    return () => {
      send({
        type: "room:leave",
        payload: { roomId },
      });
    };
  }, [isReady, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !isReady) return;

    send({
      type: "chat:send",
      payload: {
        roomId,
        text,
      },
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-slate-300">
      <div className="h-10 flex items-center gap-2 px-4 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <MessageCircle size={16} className="text-violet-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Room Chat
        </span>
        {!isReady && (
          <div
            className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse"
            title="Connecting..."
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {!isReady && (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-600 text-sm">
            <div className="w-4 h-4 border-2 border-slate-600 border-t-violet-500 rounded-full animate-spin" />
            Connecting to chat...
          </div>
        )}

        {isReady && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#1a1a24] flex items-center justify-center mb-3">
              <MessageCircle size={24} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1">
              Start the conversation!
            </p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className="group bg-[#1a1a24] hover:bg-[#1e1e2e] rounded-xl px-3 py-2.5 transition-colors"
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-violet-400">
                {m.senderName}
              </span>
              <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-sm text-slate-300 break-words leading-relaxed">
              {m.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#1e1e2e] p-3 bg-[#0a0a0f]">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={!isReady}
            className="flex-1 px-3 py-2.5 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!isReady || !text.trim()}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
