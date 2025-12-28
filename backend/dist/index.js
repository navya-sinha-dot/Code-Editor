import express from "express";
import cors from "cors";
import { createServer, IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/room.js";
import fileRoutes from "./routes/file.js";
import runRoutes from "./routes/run.js";
import { Message } from "./models/msgmodels.js";
import { User } from "./models/usermodels.js";
const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);
const wss = new WebSocketServer({ server });
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", runRoutes);
// roomId -> sockets
const rooms = new Map();
wss.on("connection", async (ws, req) => {
    try {
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const token = url.searchParams.get("token");
        if (!token || token === "null" || token === "undefined") {
            ws.close(4001, "Invalid token");
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.userId = decoded.userId;
        console.log("WebSocket authenticated:", ws.userId);
        ws.on("message", async (raw) => {
            const message = JSON.parse(raw.toString());
            /* -------- JOIN ROOM -------- */
            if (message.type === "room:join") {
                const { roomId } = message.payload;
                if (!roomId || !ws.userId)
                    return;
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId).add(ws);
                /* SEND CHAT HISTORY */
                const messages = await Message.find({ roomId })
                    .sort({ createdAt: 1 })
                    .limit(50)
                    .populate("userId", "name")
                    .lean();
                ws.send(JSON.stringify({
                    type: "chat:history",
                    payload: {
                        messages: messages.map((m) => ({
                            userId: m.userId._id, // @ts-ignore
                            senderName: m.userId.name || "Unknown",
                            text: m.text,
                            createdAt: m.createdAt,
                        })),
                    },
                }));
                console.log(`${ws.userId} joined room ${roomId}`);
            }
            /* -------- SEND CHAT -------- */
            if (message.type === "chat:send") {
                const { roomId, text } = message.payload || {};
                if (!ws.userId || !roomId || !text)
                    return;
                const savedMessage = await Message.create({
                    roomId,
                    userId: ws.userId,
                    text,
                });
                const user = await User.findById(ws.userId).select("name").lean();
                const outgoing = JSON.stringify({
                    type: "chat:receive",
                    payload: {
                        roomId,
                        userId: ws.userId,
                        senderName: user?.name ?? "Unknown",
                        text,
                        createdAt: savedMessage.createdAt,
                    },
                });
                rooms.get(roomId)?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(outgoing);
                    }
                });
            }
        });
        ws.on("close", () => {
            rooms.forEach((clients) => clients.delete(ws));
            console.log("WebSocket disconnected:", ws.userId);
        });
    }
    catch (err) {
        console.error("WebSocket auth error:", err);
        ws.close(4002, "Invalid token");
    }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map