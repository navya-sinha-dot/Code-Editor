import mongoose, { Schema, Document, Types } from "mongoose";
const MessageSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
MessageSchema.index({ roomId: 1, createdAt: 1 });
export const Message = mongoose.model("Message", MessageSchema);
//# sourceMappingURL=msgmodels.js.map