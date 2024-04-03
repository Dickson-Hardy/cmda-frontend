import api from "../api";

const verseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllVerses: build.query({
      query: () => ({ url: "/verses", method: "GET" }),
      transformResponse: (verses) => {
        return verses.data;
      },
      transformErrorResponse: (response) => response.data?.message,
    }),
    getRandomVerse: build.query({
      query: () => "/verses/get-random-verse",
      transformResponse: (verse) => verse?.data,
    }),
  }),
});

export const { useGetAllVersesQuery, useGetRandomVerseQuery } = verseApi;

export default verseApi;
