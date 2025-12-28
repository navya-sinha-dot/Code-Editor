import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MessageSchema.index({ roomId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
