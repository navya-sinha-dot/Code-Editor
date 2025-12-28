import express from "express";
import { FileModel } from "../models/filemodels.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/:roomId", async (req, res) => {
    const files = await FileModel.find({ roomId: req.params.roomId });
    res.json(files);
});
router.post("/", async (req, res) => {
    const file = await FileModel.create(req.body);
    res.json(file);
});
router.put("/:id", async (req, res) => {
    const updated = await FileModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
});
router.delete("/:id", async (req, res) => {
    await FileModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});
router.get("/:roomId/file/:fileName", async (req, res) => {
    const { roomId, fileName } = req.params;
    const file = await FileModel.findOne({
        roomId,
        name: fileName,
    });
    res.json({
        content: file?.content ?? "",
        language: file?.language ?? "plaintext",
    });
});
router.post("/:roomId/file/:fileName", async (req, res) => {
    const { roomId, fileName } = req.params;
    const { content, language } = req.body;
    await FileModel.findOneAndUpdate({ roomId, name: fileName }, { content, language }, { upsert: true });
    res.json({ success: true });
});
export default router;
//# sourceMappingURL=file.js.map