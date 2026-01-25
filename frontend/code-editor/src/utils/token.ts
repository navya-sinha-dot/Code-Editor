const TOKEN_KEY = "auth_token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token === "null" || token === "undefined") return null;
  return token;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
