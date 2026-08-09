export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://cmdabackend-38258a63fa98.herokuapp.com" : "http://localhost:3000")
).replace(/\/$/, "");
