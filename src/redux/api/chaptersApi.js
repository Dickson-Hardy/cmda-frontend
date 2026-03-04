import api from "./api";

const chaptersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllChapters: build.query({
      query: ({ type } = {}) => ({
        url: "/chapters",
        params: type ? { type } : {},
      }),
      transformResponse: (response) => {
        // API returns chapters as a flat array directly
        // Transform to match expected format: { items: [...], meta: {...} }
        if (Array.isArray(response)) {
          return {
            items: response,
            meta: {
              totalItems: response.length,
              currentPage: 1,
              itemsPerPage: response.length,
              totalPages: 1,
            },
          };
        }
        // If response already has the expected structure
        return response.data || response;
      },
      providesTags: ["CHAPTERS"],
    }),
  }),
});

export const { useGetAllChaptersQuery } = chaptersApi;

export default chaptersApi;
