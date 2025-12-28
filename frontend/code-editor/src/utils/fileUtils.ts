export const LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
  cpp: "cpp",
  c: "c",
  java: "java",
  go: "go",
  rs: "rust",
  php: "php",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  sql: "sql",
  xml: "xml",
  yml: "yaml",
  yaml: "yaml",
};

export function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (!ext) return "plaintext";

  return LANGUAGE_MAP[ext] || "plaintext";
}
