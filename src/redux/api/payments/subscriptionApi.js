import api from "../api";

const subscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    initSubscriptionSession: build.mutation({
      query: (body) => ({ url: "/subscriptions/pay", body, method: "POST" }),
      transformResponse: (response) => response.data,
    }),
    saveSubscription: build.mutation({
      query: (body) => ({ url: "/subscriptions/save", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["SUBSCRIPTION"],
    }),
    getAllSubscriptions: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/subscriptions/history",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["SUBSCRIPTION"],
    }),
  }),
});

export const { useInitSubscriptionSessionMutation, useSaveSubscriptionMutation, useGetAllSubscriptionsQuery } =
  subscriptionApi;

export default subscriptionApi;
