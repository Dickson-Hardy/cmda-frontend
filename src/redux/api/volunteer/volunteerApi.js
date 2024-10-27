import api from "../api";

const volunteerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVolunteerJobs: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/volunteer/jobs",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
    }),
    getSingleVolunteerJob: build.query({
      query: (id) => `/volunteer/jobs/${id}`,
      transformResponse: (response) => response.data,
      providesTags: ["SINGLE_JOB"],
    }),
    volunteerForJob: build.mutation({
      query: ({ id }) => ({ url: `/volunteer/jobs/${id}/register`, method: "POST" }),
      invalidatesTags: ["SINGLE_JOB"],
    }),
  }),
});

export const { useGetVolunteerJobsQuery, useGetSingleVolunteerJobQuery, useVolunteerForJobMutation } = volunteerApi;

export default volunteerApi;
