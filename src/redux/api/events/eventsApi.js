import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ page, limit, searchText, date, status }) => ({
        url: "/events",
        params: {
          page,
          limit,
          ...(searchText ? { keyword: searchText } : {}),
          ...(status ? { status } : {}),
          ...(date ? { date } : {}),
        },
      }),
      transformResponse: ({ data: { items, meta } }) => {
        const totalPages = meta.totalPages;
        const totalItems = meta.totalItems;
        return { items, totalItems, totalPages };
      },
    }),
    getSingleEvent: build.query({
      query: (id) => `/events/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllEventsQuery, useGetSingleEventQuery } = eventsApi;

export default eventsApi;
