import api from "../api";

const paymentIntentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyPaymentIntents: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/payment-intents/me",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["PAYMENT_INTENTS"],
    }),
    lookupPaymentIntentsByEmail: build.mutation({
      query: (body) => ({ url: "/payment-intents/lookup-email", body, method: "POST" }),
      transformResponse: (response) => response.data,
    }),
    requeryPaymentIntents: build.mutation({
      query: (body) => ({ url: "/payment-intents/requery", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["PAYMENT_INTENTS", "DONATIONS", "SUBSCRIPTIONS", "ORDERS", "EVENTS"],
    }),
  }),
});

export const { useGetMyPaymentIntentsQuery, useLookupPaymentIntentsByEmailMutation, useRequeryPaymentIntentsMutation } =
  paymentIntentsApi;

export default paymentIntentsApi;
