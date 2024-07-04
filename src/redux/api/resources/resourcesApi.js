import api from "../api";

const resourceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllResources: build.query({
      query: ({ page, limit, searchBy }) => ({
        url: "/resources",
        params: { page, limit, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => response.data,
    }),
    getResourceBySlug: build.query({
      query: (slug) => ({ url: `/resources/${slug}` }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllResourcesQuery, useGetResourceBySlugQuery } = resourceApi;

export default resourceApi;
