import api from "../api";

const donationApi = api.injectEndpoints({
  endpoints: (build) => ({
    initDonationSession: build.mutation({
      query: (body) => ({ url: "/donations/init", body, method: "POST" }),
      transformResponse: (response) => response.data,
    }),
    saveDonation: build.mutation({
      query: (body) => ({ url: "/donations/create", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DONATIONS"],
    }),
    getAllDonations: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/donations/user",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["DONATIONS"],
    }),
    exportDonations: build.mutation({
      queryFn: async ({ callback, userId }, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `/donations/export?userId=${userId}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
          cache: "no-cache",
        });

        callback(result);
        return { data: null };
      },
    }),
    syncDonationPaymentStatus: build.mutation({
      query: (body) => ({ url: "/donations/sync-payment-status", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DONATIONS"],
    }),
  }),
});

export const {
  useInitDonationSessionMutation,
  useSaveDonationMutation,
  useGetAllDonationsQuery,
  useExportDonationsMutation,
  useSyncDonationPaymentStatusMutation,
} = donationApi;

export default donationApi;
