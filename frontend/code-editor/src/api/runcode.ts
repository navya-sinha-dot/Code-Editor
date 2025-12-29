import axios from "axios";
import { getToken } from "../utils/token";
import { BACKEND_URL } from "../config";

export async function runCode(code: string, language: string, input?: string) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await axios.post(
    `${BACKEND_URL}/api/run`,
    { code, language, input },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}
