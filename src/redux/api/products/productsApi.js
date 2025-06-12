import api from "../api";

const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/products",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
    }),
    getSingleProduct: build.query({
      query: (slug) => ({ url: `/products/${slug}` }),
      transformResponse: (response) => response.data,
    }),
    payOrderSession: build.mutation({
      query: (body) => ({ url: "/orders/pay", body, method: "POST" }),
      transformResponse: (response) => response.data,
    }),
    createOrder: build.mutation({
      query: (body) => ({ url: "/orders/create", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["ORDERS"],
    }),
    getOrderHistory: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/orders/history",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["ORDERS"],
    }),
    getSingleOrder: build.query({
      query: (id) => ({ url: `/orders/${id}` }),
      transformResponse: (response) => response.data,
    }),
    syncOrderPaymentStatus: build.mutation({
      query: (body) => ({ url: "/orders/sync-payment-status", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["ORDERS"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  usePayOrderSessionMutation,
  useCreateOrderMutation,
  useGetOrderHistoryQuery,
  useGetSingleOrderQuery,
  useSyncOrderPaymentStatusMutation,
} = productsApi;

export default productsApi;
