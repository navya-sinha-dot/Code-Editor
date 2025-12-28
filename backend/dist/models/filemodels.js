import mongoose from "mongoose";
const FileSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    name: { type: String, required: true },
    language: { type: String, required: true },
    content: { type: String, default: "" },
}, { timestamps: true });
export const FileModel = mongoose.model("File", FileSchema);
//# sourceMappingURL=filemodels.js.map