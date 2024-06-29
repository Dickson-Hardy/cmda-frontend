import api from "../api";

const volunteerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVolunteerJobs: build.query({
      query: ({ page, limit }) => ({ url: "/volunteer/jobs", params: { page, limit } }),
      transformResponse: ({ data: { items, meta } }) => {
        const totalPages = meta.totalPages;
        const totalItems = meta.totalItems;
        return { data: items, totalItems, totalPages };
      },
    }),
    getSingleVolunteerJob: build.query({
      query: (id) => `/volunteers/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetVolunteerJobsQuery, useGetSingleVolunteerJobQuery } = volunteerApi;

export default volunteerApi;
