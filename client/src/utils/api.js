// API base URL - must match backend port (5001)
// Dev: empty = Vite proxy forwards /api → localhost:5001
// Prod: same origin when served by Express at 5001
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : (typeof window !== "undefined" ? window.location.origin : ""));

const TOKEN_KEY = "furnish_token";

export function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = { ...options.headers };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (import.meta.env.DEV && path.includes("/auth/")) {
    console.debug("[api] Request:", options.method || "GET", url);
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

