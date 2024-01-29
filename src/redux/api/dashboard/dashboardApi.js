import api from "../api";

const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardActivityLog: build.query({
      query: ({ earlierDate, laterDate }) => ({
        url: `/activity-log/dashboard?earlierDate=${earlierDate}&laterDate=${laterDate}`,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetDashboardActivityLogQuery } = dashboardApi;

export default dashboardApi;
