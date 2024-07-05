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
  }),
});

export const { useGetAllProductsQuery, useGetSingleProductQuery } = productsApi;

export default productsApi;
