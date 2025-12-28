import mongoose from "mongoose";
const YjsFileSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    fileId: { type: String, required: true },
    snapshot: { type: Buffer, required: true },
}, { timestamps: true });
YjsFileSchema.index({ roomId: 1, fileId: 1 }, { unique: true });
export const YjsFile = mongoose.model("YjsFile", YjsFileSchema);
//# sourceMappingURL=Yjsfile.js.map