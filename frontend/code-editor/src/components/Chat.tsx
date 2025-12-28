import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

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
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-300">
      <div className="px-4 py-3 border-b border-slate-800 font-semibold text-slate-200">
        Room Chat
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!isReady && (
          <div className="text-center text-slate-500 text-sm py-4">
            Connecting to chat...
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg px-3 py-2 text-sm border border-slate-700">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-indigo-400">{m.senderName}</span>
              <span className="text-[10px] text-slate-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-slate-300 break-words">{m.text}</div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-800 p-3 flex gap-2 bg-slate-900">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          disabled={!isReady}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isReady}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
