import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = Router();
router.use(authMiddleware);
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;
const LANGUAGE_MAP = {
    javascript: 63,
    typescript: 74,
    python: 71,
    cpp: 54,
    c: 50,
    java: 62,
    go: 60,
    rust: 73,
    php: 68,
    ruby: 72,
};
router.post("/run", async (req, res) => {
    const { code, language, input } = req.body;
    const languageId = LANGUAGE_MAP[language];
    if (!languageId) {
        return res.status(400).json({ error: "Unsupported language" });
    }
    try {
        const submission = await axios.post(`${JUDGE0_URL}/submissions`, {
            source_code: code,
            language_id: languageId,
            stdin: input || "",
        }, {
            headers: {
                "X-RapidAPI-Key": JUDGE0_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            params: { wait: true },
        });
        const result = submission.data;
        res.json({
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            status: result.status.description,
            time: result.time,
            memory: result.memory,
        });
    }
    catch (err) {
        console.error("Executor Error:", err.response?.data || err.message);
        res.status(500).json({
            error: err.response?.data?.error || "Execution failed",
            details: err.response?.data || err.message
        });
    }
});
export default router;
//# sourceMappingURL=run.js.map