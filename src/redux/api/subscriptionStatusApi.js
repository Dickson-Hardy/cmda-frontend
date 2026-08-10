import { api } from "./api";

export const subscriptionStatusApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptionStatus: build.query({
      query: () => "/subscriptions/status",
      providesTags: ["SUBSCRIPTION_STATUS"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSubscriptionStatusQuery } = subscriptionStatusApi;
