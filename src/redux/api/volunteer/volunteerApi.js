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
    getMyApplications: build.query({
      query: () => "/volunteer/my-applications",
      transformResponse: (response) => response.data,
      providesTags: ["MY_APPLICATIONS"],
    }),
    withdrawApplication: build.mutation({
      query: (id) => ({ url: `/volunteer/jobs/${id}/register`, method: "DELETE" }),
      invalidatesTags: ["SINGLE_JOB", "MY_APPLICATIONS"],
    }),
    getShiftsForJob: build.query({
      query: ({ jobId }) => `/volunteer/jobs/${jobId}/shifts`,
      transformResponse: (response) => response.data,
      providesTags: ["JOB_SHIFTS"],
    }),
    signUpForShift: build.mutation({
      query: ({ shiftId }) => ({ url: `/volunteer/shifts/${shiftId}/signup`, method: "POST" }),
      invalidatesTags: ["JOB_SHIFTS", "MY_SHIFTS"],
    }),
    withdrawFromShift: build.mutation({
      query: ({ shiftId }) => ({ url: `/volunteer/shifts/${shiftId}/signup`, method: "DELETE" }),
      invalidatesTags: ["JOB_SHIFTS", "MY_SHIFTS"],
    }),
    getMyShifts: build.query({
      query: () => "/volunteer/my-shifts",
      transformResponse: (response) => response.data,
      providesTags: ["MY_SHIFTS"],
    }),
  }),
});

export const {
  useGetVolunteerJobsQuery,
  useGetSingleVolunteerJobQuery,
  useVolunteerForJobMutation,
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
  useGetShiftsForJobQuery,
  useSignUpForShiftMutation,
  useWithdrawFromShiftMutation,
  useGetMyShiftsQuery,
} = volunteerApi;

export default volunteerApi;
