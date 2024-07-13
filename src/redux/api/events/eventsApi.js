import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ limit, page, searchBy, eventDate, eventType, membersGroup }) => ({
        url: "/events",
        params: {
          limit,
          page,
          ...(searchBy ? { searchBy } : {}),
          ...(eventDate ? { eventDate } : {}),
          ...(eventType ? { eventType } : {}),
          ...(membersGroup ? { membersGroup } : {}),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["EVENTS"],
    }),
    getSingleEvent: build.query({
      query: (slug) => `/events/${slug}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllEventsQuery, useGetSingleEventQuery } = eventsApi;

export default eventsApi;
