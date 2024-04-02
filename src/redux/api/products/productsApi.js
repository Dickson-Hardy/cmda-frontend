import api from "../api";

const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: ({ page, limit, searchText, status }) => ({
        url: "/products",
        params: {
          page,
          limit,
          ...(searchText ? { searchText } : {}),
          ...(status ? { status } : {}),
        },
      }),
    }),
    getSingleProduct: build.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllProductsQuery, useGetSingleProductQuery } = productsApi;

export default productsApi;
