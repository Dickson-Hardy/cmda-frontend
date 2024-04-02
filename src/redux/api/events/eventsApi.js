import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ page, limit, searchText, eventDate, status }) => ({
        url: "/events",
        params: {
          page,
          limit,
          ...(searchText ? { searchText } : {}),
          ...(status ? { status } : {}),
          ...(eventDate ? { eventDate } : {}),
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
