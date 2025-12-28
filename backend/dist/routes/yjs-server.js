import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";
// @ts-ignore — y-websocket does not ship types for this path
import { setupWSConnection } from "y-websocket/bin/utils.js";
export function startYjsServer(server) {
    const wss = new WebSocketServer({
        server,
        path: "/yjs",
    });
    wss.on("connection", (ws, req) => {
        try {
            const url = new URL(req.url, "http://localhost");
            const token = url.searchParams.get("token");
            if (!token) {
                ws.close();
                return;
            }
            jwt.verify(token, process.env.JWT_SECRET);
            setupWSConnection(ws, req);
        }
        catch (err) {
            ws.close();
        }
    });
    console.log("🧠 Yjs WebSocket server running on /yjs");
}
//# sourceMappingURL=yjs-server.js.map