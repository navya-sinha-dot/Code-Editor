import { Router } from "express";
import mongoose from "mongoose";
import { Room } from "../models/roommodels.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = Router();
//creating room
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.json({
                message: "Room name required",
            });
        }
        if (!req.userId) {
            return res.json({
                message: "Unauthorized",
            });
        }
        const room = await Room.create({
            name,
            createdBy: req.userId,
            members: [
                {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    role: "OWNER",
                },
            ],
            files: [],
        });
        res.json(room);
    }
    catch (err) {
        res.json({
            message: "Room creation Failed",
        });
    }
});
//joining room
router.post("/:roomId/join", authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const roomId = req.params.roomId;
        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ message: "Invalid room ID" });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const alreadyMember = room.members.some((m) => m.userId.toString() === req.userId);
        if (alreadyMember) {
            return res.status(409).json({ message: "Already a member" });
        }
        room.members.push({
            userId: new mongoose.Types.ObjectId(req.userId),
            role: "EDITOR",
            joinedAt: new Date(),
        });
        await room.save();
        return res.json({ message: "Joined room successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Join room failed" });
    }
});
//fetching rooms
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const rooms = await Room.find({
            "members.userId": new mongoose.Types.ObjectId(req.userId),
        }).select("_id name createdAt");
        res.json(rooms);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});
//leaving a room
router.post("/:roomId/leave", authMiddleware, async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        room.members = room.members.filter((m) => m.userId.toString() !== req.userId);
        await room.save();
        res.json({ message: "Left room successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Leave room failed" });
    }
});
//deleting a room
router.delete("/:roomId", authMiddleware, async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const member = room.members.find((m) => m.userId.toString() === req.userId);
        if (!member || member.role !== "OWNER") {
            return res.status(403).json({ message: "Not authorized" });
        }
        await room.deleteOne();
        res.json({ message: "Room deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Delete room failed" });
    }
});
export default router;
//# sourceMappingURL=room.js.map