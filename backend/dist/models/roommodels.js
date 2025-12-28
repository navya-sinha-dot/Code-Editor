import mongoose, { Schema, Document, Types } from "mongoose";
const FileNodeSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["FILE", "FOLDER"], required: true },
    path: { type: String, required: true },
    contentSnapshot: { type: String },
    children: [],
    updatedAt: { type: Date, default: Date.now },
}, { _id: true });
const RoomMemberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
        type: String,
        enum: ["OWNER", "EDITOR", "VIEWER"],
        default: "EDITOR",
    },
    joinedAt: { type: Date, default: Date.now },
}, { _id: false });
const RoomSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [RoomMemberSchema],
    files: [FileNodeSchema],
}, { timestamps: true });
export const Room = mongoose.model("Room", RoomSchema);
//# sourceMappingURL=roommodels.js.map