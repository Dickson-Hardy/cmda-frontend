import api from "../api";

const volunteerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVolunteerJobs: build.query({
      query: ({ page, limit }) => ({ url: "/volunteers", params: { page, limit } }),
    }),
    getSingleVolunteerJob: build.query({
      query: (id) => `/volunteers/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetVolunteerJobsQuery, useGetSingleVolunteerJobQuery } = volunteerApi;

export default volunteerApi;
