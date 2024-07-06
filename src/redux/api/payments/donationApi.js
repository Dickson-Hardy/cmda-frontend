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
  }),
});

export const { useInitDonationSessionMutation, useSaveDonationMutation, useGetAllDonationsQuery } = donationApi;

export default donationApi;
