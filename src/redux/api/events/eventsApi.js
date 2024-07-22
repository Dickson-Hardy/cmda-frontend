import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ limit, page, searchBy, eventDate, eventType, membersGroup, fromToday }) => ({
        url: "/events",
        params: {
          limit,
          page,
          ...(searchBy ? { searchBy } : {}),
          ...(eventDate ? { eventDate } : {}),
          ...(eventType ? { eventType } : {}),
          ...(membersGroup ? { membersGroup } : {}),
          ...(fromToday ? { fromToday } : {}),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["EVENTS"],
    }),
    getSingleEvent: build.query({
      query: (slug) => `/events/${slug}`,
      transformResponse: (response) => response.data,
    }),
    getAllTrainings: build.query({
      query: ({ searchBy, membersGroup }) => ({
        url: "/trainings",
        params: { ...(searchBy ? { searchBy } : {}), ...(membersGroup ? { membersGroup } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["TRAININGS"],
    }),
  }),
});

export const { useGetAllEventsQuery, useGetSingleEventQuery, useGetAllTrainingsQuery } = eventsApi;

export default eventsApi;
