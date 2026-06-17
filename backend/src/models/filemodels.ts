import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["FILE", "FOLDER"],
      required: true,
      default: "FILE",
    },
    parentId: { type: String, default: null },
    language: { type: String, default: "plaintext" },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

FileSchema.index({ roomId: 1, name: 1, parentId: 1 });

export const FileModel = mongoose.model("File", FileSchema);
