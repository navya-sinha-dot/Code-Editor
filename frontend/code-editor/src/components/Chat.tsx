import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Send } from "lucide-react";

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
    <div className="flex flex-col h-full">
      <div className="h-9 flex items-center px-3 border-b border-[#3e3e42] bg-[#252526]">
        <span className="text-xs text-[#cccccc]">Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!isReady && (
          <div className="flex items-center justify-center py-8 text-[#858585] text-xs">
            Connecting...
          </div>
        )}

        {isReady && messages.length === 0 && (
          <div className="flex items-center justify-center py-12 text-[#858585] text-xs">
            No messages yet
          </div>
        )}

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
            <div className="text-xs text-[#cccccc] leading-relaxed">
              {m.text}
            </div>
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
            disabled={!isReady}
            className="flex-1 px-2 py-1.5 bg-[#3c3c3c] border border-[#3e3e42] rounded-sm text-xs text-[#cccccc] placeholder-[#858585] focus:outline-none focus:border-[#360B54] disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!isReady || !text.trim()}
            className="px-3 py-1.5 hover:bg-[#6B0B8F] bg-[#480663] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-sm"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
