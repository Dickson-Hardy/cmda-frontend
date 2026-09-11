import api from "./api";

const chaptersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllChapters: build.query({
      query: ({ type } = {}) => ({
        url: "/chapters",
        params: type ? { type } : {},
      }),
      transformResponse: (response) => {
        const payload = response?.data ?? response;

        // Keep a consistent shape for both the legacy array response used by
        // public selectors and the paginated response used by management pages.
        if (Array.isArray(payload)) {
          return {
            items: payload,
            meta: {
              totalItems: payload.length,
              currentPage: 1,
              itemsPerPage: payload.length,
              totalPages: payload.length > 0 ? 1 : 0,
            },
          };
        }

        return payload;
      },
      providesTags: ["CHAPTERS"],
    }),
  }),
});

export const { useGetAllChaptersQuery } = chaptersApi;

export default chaptersApi;
