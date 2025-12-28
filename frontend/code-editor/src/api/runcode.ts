import axios from "axios";

export async function runCode(code: string, language: string) {
  const res = await axios.post(
    "http://localhost:3000/api/run",
    { code, language },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return res.data;
}
