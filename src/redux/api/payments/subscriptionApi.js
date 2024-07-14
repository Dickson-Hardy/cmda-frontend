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
    exportSubscriptions: build.mutation({
      queryFn: async ({ callback, userId }, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `/subscriptions/export?userId=${userId}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
          cache: "no-cache",
        });

        callback(result);
        return { data: null };
      },
    }),
  }),
});

export const {
  useInitSubscriptionSessionMutation,
  useSaveSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useExportSubscriptionsMutation,
} = subscriptionApi;

export default subscriptionApi;
