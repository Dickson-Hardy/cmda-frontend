import api from "../api";

const resourceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllResources: build.query({
      query: ({ page, limit, searchBy, category }) => ({
        url: "/resources",
        params: { page, limit, ...(searchBy ? { searchBy } : {}), ...(category ? { category } : {}) },
      }),
      transformResponse: (response) => response.data,
    }),
    getResourceBySlug: build.query({
      query: (slug) => ({ url: `/resources/${slug}` }),
      transformResponse: (response) => response.data,
    }),
    downloadResource: build.query({
      query: (slug) => ({
        url: `/resources/${slug}/download`,
      }),
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const { useGetAllResourcesQuery, useGetResourceBySlugQuery, useDownloadResourceQuery } = resourceApi;

export default resourceApi;
