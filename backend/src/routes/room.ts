import type { Response } from "express";
import { Router } from "express";
import mongoose from "mongoose";
import { Room } from "../models/roommodels.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import type { AuthRequest } from "../middlewares/authmiddleware.js";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
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
  } catch (err) {
    res.json({
      message: "Room creation Failed",
    });
  }
});

router.post(
  "/:roomId/join",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
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

      const alreadyMember = room.members.some(
        (m) => m.userId.toString() === req.userId
      );

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
    } catch (err) {
      return res.status(500).json({ message: "Join room failed" });
    }
  }
);

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rooms = await Room.find({
      "members.userId": new mongoose.Types.ObjectId(req.userId),
    });

    const response = rooms.map((room) => {
      const member = room.members.find(
        (m) => m.userId.toString() === req.userId
      );

      return {
        _id: room._id,
        name: room.name,
        createdAt: room.createdAt,
        role: member?.role,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

router.post(
  "/:roomId/leave",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { roomId } = req.params;

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      room.members = room.members.filter(
        (m) => m.userId.toString() !== req.userId
      );

      await room.save();

      res.json({ message: "Left room successfully" });
    } catch (err) {
      res.status(500).json({ message: "Leave room failed" });
    }
  }
);

router.delete(
  "/:roomId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { roomId } = req.params;

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const member = room.members.find(
        (m) => m.userId.toString() === req.userId
      );

      if (!member || member.role !== "OWNER") {
        return res.status(403).json({ message: "Not authorized" });
      }

      await room.deleteOne();

      res.json({ message: "Room deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete room failed" });
    }
  }
);

router.get(
  "/:roomId/participants",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        return res.json({
          message: "Roomid is required",
        });
      }

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      const room = await Room.findById(roomId)
        .populate("members.userId", "name")
        .select("members");

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const participants = room.members.map((m) => ({
        userId: (m.userId as any)._id.toString(),
        name: (m.userId as any).name,
        role: m.role,
      }));

      return res.json({ participants });
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch participants" });
    }
  }
);

router.post(
  "/:roomId/remove/:userId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { roomId, userId } = req.params;

      if (!roomId || !userId) {
        return res.json({
          message: "roomid and userid is required",
        });
      }

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (
        !mongoose.Types.ObjectId.isValid(roomId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const requester = room.members.find(
        (m) => m.userId.toString() === req.userId
      );

      if (!requester || requester.role !== "OWNER") {
        return res.status(403).json({ message: "Only owner can remove users" });
      }

      if (req.userId === userId) {
        return res
          .status(400)
          .json({ message: "Owner cannot remove themselves" });
      }

      room.members = room.members.filter((m) => m.userId.toString() !== userId);

      await room.save();

      const updatedRoom = await Room.findById(roomId)
        .populate("members.userId", "name")
        .select("members");

      const participants = updatedRoom!.members.map((m) => ({
        userId: (m.userId as any)._id.toString(),
        name: (m.userId as any).name,
        role: m.role,
      }));

      return res.json({
        message: "User removed successfully",
        participants,
      });
    } catch (err) {
      return res.status(500).json({ message: "Failed to remove user" });
    }
  }
);

export default router;
