import mongoose from "mongoose";
import { Room } from "../models/roommodels.js";

export async function isRoomMember(roomId?: string, userId?: string) {
  if (
    !roomId ||
    !userId ||
    !mongoose.Types.ObjectId.isValid(roomId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return false;
  }

  const room = await Room.exists({
    _id: roomId,
    "members.userId": new mongoose.Types.ObjectId(userId),
  });

  return Boolean(room);
}
