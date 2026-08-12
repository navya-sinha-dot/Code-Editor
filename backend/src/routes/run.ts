import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = Router();
router.use(authMiddleware);

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

const LANGUAGE_MAP: Record<string, number> = {
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
    return res.status(400).json({
      error: "Unsupported language",
    });
  }

  try {
    // Base64 encode source code and input
    const encodedCode = Buffer.from(
      code || "",
      "utf8"
    ).toString("base64");

    const encodedInput = Buffer.from(
      input || "",
      "utf8"
    ).toString("base64");

    const submission = await axios.post(
      `${JUDGE0_URL}/submissions`,
      {
        source_code: encodedCode,
        language_id: languageId,
        stdin: encodedInput,
      },
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        params: {
          wait: true,
          base64_encoded: true,
        },
      }
    );

    const result = submission.data;

    // Decode Base64 response from Judge0
    const decodeBase64 = (
      value: string | null | undefined
    ): string => {
      if (!value) {
        return "";
      }

      return Buffer.from(value, "base64").toString("utf8");
    };

    res.json({
      stdout: decodeBase64(result.stdout),
      stderr: decodeBase64(result.stderr),
      compile_output: decodeBase64(result.compile_output),
      message: decodeBase64(result.message),
      status: result.status?.description || "Unknown",
      time: result.time,
      memory: result.memory,
    });

  } catch (err: any) {
    console.error(
      "Executor Error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      error:
        err.response?.data?.error ||
        "Execution failed",

      details:
        err.response?.data ||
        err.message,
    });
  }
});

export default router;
