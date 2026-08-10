import api from "../api";

const toList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n|;|\u2022/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeJob = (job) => ({
  ...job,
  companyName: job?.companyName ?? job?.company,
  companyLocation: job?.companyLocation ?? job?.location,
  responsibilities: toList(job?.responsibilities),
  requirements: toList(job?.requirements),
});

const normalizeShift = (shift) => ({
  ...shift,
  startDate: shift?.startDate ?? shift?.startTime,
  endDate: shift?.endDate ?? shift?.endTime,
  currentVolunteers: shift?.currentVolunteers ?? shift?.volunteers?.length ?? 0,
  volunteerCount: shift?.volunteerCount ?? shift?.volunteers?.length ?? 0,
  status: shift?.myStatus ?? shift?.status,
});

const normalizePage = (response, mapper) => {
  const data = response?.data ?? response;
  return { ...(data || {}), items: (Array.isArray(data?.items) ? data.items : []).map(mapper) };
};

const volunteerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVolunteerJobs: build.query({
      query: ({ page, limit, searchBy, category }) => ({
        url: "/volunteer/jobs",
        params: { page, limit, ...(searchBy ? { search: searchBy } : {}), ...(category ? { category } : {}) },
      }),
      transformResponse: (response) => normalizePage(response, normalizeJob),
    }),
    getSingleVolunteerJob: build.query({
      query: (id) => `/volunteer/jobs/${id}`,
      transformResponse: (response) => normalizeJob(response?.data ?? response),
      providesTags: ["SINGLE_JOB"],
    }),
    volunteerForJob: build.mutation({
      query: ({ id }) => ({ url: `/volunteer/jobs/${id}/register`, method: "POST" }),
      invalidatesTags: ["SINGLE_JOB"],
    }),
    getMyApplications: build.query({
      query: () => "/volunteer/my-applications",
      transformResponse: (response) =>
        normalizePage(response, (job) => ({
          ...normalizeJob(job),
          status: job?.application?.status,
          appliedAt: job?.application?.appliedAt,
        })),
      providesTags: ["MY_APPLICATIONS"],
    }),
    withdrawApplication: build.mutation({
      query: (id) => ({ url: `/volunteer/jobs/${id}/register`, method: "DELETE" }),
      invalidatesTags: ["SINGLE_JOB", "MY_APPLICATIONS"],
    }),
    getShiftsForJob: build.query({
      query: ({ jobId }) => `/volunteer/jobs/${jobId}/shifts`,
      transformResponse: (response) => normalizePage(response, normalizeShift),
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
      transformResponse: (response) =>
        normalizePage(response, (shift) => ({
          ...normalizeShift(shift),
          job: shift?.job ? normalizeJob(shift.job) : shift?.job,
        })),
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
