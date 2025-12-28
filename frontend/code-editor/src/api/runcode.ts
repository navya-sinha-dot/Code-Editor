import axios from "axios";
import { getToken } from "../utils/token";

export async function runCode(code: string, language: string, input?: string) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await axios.post(
    "http://localhost:3000/api/run",
    { code, language, input },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}
