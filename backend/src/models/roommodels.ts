import mongoose, { Schema, Document, Types } from "mongoose";

export type Role = "OWNER" | "EDITOR" | "VIEWER";
export type FileType = "FILE" | "FOLDER";

interface IRoomMember {
  userId: Types.ObjectId;
  role: Role;
  joinedAt: Date;
}

interface IFileNode {
  _id: Types.ObjectId;
  name: string;
  type: FileType;
  path: string;
  contentSnapshot?: string;
  children?: IFileNode[];
  updatedAt: Date;
}

export interface IRoom extends Document {
  name: string;
  createdBy: Types.ObjectId;
  members: IRoomMember[];
  files: IFileNode[];
  createdAt: Date;
  updatedAt: Date;
}

const FileNodeSchema = new Schema<IFileNode>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["FILE", "FOLDER"], required: true },
    path: { type: String, required: true },
    contentSnapshot: { type: String },
    children: [],
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const RoomMemberSchema = new Schema<IRoomMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["OWNER", "EDITOR", "VIEWER"],
      default: "EDITOR",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    members: [RoomMemberSchema],
    files: [FileNodeSchema],
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>("Room", RoomSchema);
