import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Only log in development
if (import.meta.env.DEV) {
  console.log("API Base URL:", baseUrl);
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().token?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
    fetchFn: async (...args) => {
      try {
        return await fetch(...args);
      } catch (error) {
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          throw new Error("Network error: Please check your internet connection");
        }
        throw error;
      }
    },
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0.0001,
  tagTypes: ["Auth", "User", "Events", "Store"], // Define tag types for better caching
  endpoints: () => ({}),
});

export default api;
