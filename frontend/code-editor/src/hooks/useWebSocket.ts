import { useEffect, useRef, useState } from "react";
import { getToken } from "../utils/token";
import { WS_BACKEND_URL } from "../config";

export const useWebSocket = (onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef(onMessage);
  const [isReady, setIsReady] = useState(false);

  handlerRef.current = onMessage;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const ws = new WebSocket(`${WS_BACKEND_URL}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsReady(true);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      handlerRef.current(data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsReady(false);
    };

    ws.onerror = () => {
      console.log("WebSocket error");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const send = (data: any) => {
    if (!wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify(data));
  };

  return { send, isReady };
};
