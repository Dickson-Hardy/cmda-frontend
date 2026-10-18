import api from "../api";
const zelleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getZelleSettings: build.query({ query: () => "/zelle/settings", transformResponse: (r) => r.data }),
    getMyZellePayments: build.query({
      query: (page = 1) => ({ url: "/zelle/intents", params: { page } }),
      transformResponse: (r) => r.data,
      providesTags: ["PAYMENT_INTENTS"],
    }),
    createZellePayment: build.mutation({
      query: (body) => ({ url: "/zelle/intents", method: "POST", body }),
      transformResponse: (r) => r.data,
      invalidatesTags: ["PAYMENT_INTENTS"],
    }),
    uploadZelleProof: build.mutation({
      query: ({ id, body }) => ({ url: `/zelle/intents/${id}/proof`, method: "POST", body }),
      transformResponse: (r) => r.data,
      invalidatesTags: ["PAYMENT_INTENTS", "SUBSCRIPTION_STATUS"],
    }),
  }),
});
export const {
  useGetZelleSettingsQuery,
  useGetMyZellePaymentsQuery,
  useCreateZellePaymentMutation,
  useUploadZelleProofMutation,
} = zelleApi;
