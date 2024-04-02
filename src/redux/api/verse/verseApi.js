import api from "../api";

const verseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllVerses: build.query({
      query: () => ({ url: "/verses", method: "GET" }),
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useGetAllVersesQuery } = verseApi;

export default verseApi;
