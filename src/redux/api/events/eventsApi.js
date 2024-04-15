import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ page, limit, searchText, date, status }) => ({
        url: "/events",
        params: {
          page,
          limit,
          ...(searchText ? { searchText } : {}),
          ...(status ? { status } : {}),
          ...(date ? { date } : {}),
        },
      }),
    }),
    getSingleEvent: build.query({
      query: (id) => `/events/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllEventsQuery, useGetSingleEventQuery } = eventsApi;

export default eventsApi;
