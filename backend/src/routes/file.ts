import express from "express";
import { FileModel } from "../models/filemodels.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import type { AuthRequest } from "../middlewares/authmiddleware.js";
import { isRoomMember } from "../utils/roomAuth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:roomId", async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required" });
  }

  const allowed = await isRoomMember(roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  const files = await FileModel.find({ roomId });
  return res.json(files);
});

router.post("/", async (req: AuthRequest, res) => {
  const { roomId, name, type, parentId, language, content } = req.body;
  const allowed = await isRoomMember(roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  const fileType = type === "FOLDER" ? "FOLDER" : "FILE";
  const file = await FileModel.create({
    roomId,
    name,
    type: fileType,
    parentId: parentId ?? null,
    language: fileType === "FOLDER" ? "plaintext" : language ?? "plaintext",
    content: fileType === "FOLDER" ? "" : content ?? "",
  });

  return res.json(file);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const existing = await FileModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "File not found" });
  }

  const allowed = await isRoomMember(existing.roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  const updated = await FileModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.json(updated);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const existing = await FileModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "File not found" });
  }

  const allowed = await isRoomMember(existing.roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  await FileModel.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
});

router.get("/:roomId/file/:fileName", async (req: AuthRequest, res) => {
  const { roomId, fileName } = req.params;
  if (!roomId || !fileName) {
    return res.status(400).json({ message: "Room ID and file name are required" });
  }

  const allowed = await isRoomMember(roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  const file = await FileModel.findOne({
    roomId,
    name: fileName,
  });

  return res.json({
    content: file?.content ?? "",
    language: file?.language ?? "plaintext",
  });
});

router.post("/:roomId/file/:fileName", async (req: AuthRequest, res) => {
  const { roomId, fileName } = req.params;
  const { content, language } = req.body;
  if (!roomId || !fileName) {
    return res.status(400).json({ message: "Room ID and file name are required" });
  }

  const allowed = await isRoomMember(roomId, req.userId);
  if (!allowed) {
    return res.status(403).json({ message: "Not authorized for this room" });
  }

  await FileModel.findOneAndUpdate(
    { roomId, name: fileName },
    { content, language, type: "FILE" },
    { upsert: true }
  );

  return res.json({ success: true });
});

export default router;
