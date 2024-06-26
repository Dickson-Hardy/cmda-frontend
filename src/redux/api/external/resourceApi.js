import api from "../api";

const wordpressBaseUrl = import.meta.env.VITE_WORDPRESS_API_URL;

const resourceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllResources: build.query({
      query: ({ page, limit, searchText }) => ({
        url: "/resources",
        params: {
          page,
          limit,
          ...(searchText ? { keyword: searchText } : {}),
        },
      }),
      transformResponse: ({ data: { items, meta } }) => {
        const totalPages = meta.totalPages;
        const totalItems = meta.totalItems;
        return { items, totalItems, totalPages };
      },
    }),
    // getSinglePost: build.query({
    //   query: ({ slug }) => wordpressBaseUrl + "/posts?slug=" + slug + "&_embed",
    //   transformResponse: (posts) => posts[0],
    // }),
  }),
});

export const { useGetAllResourcesQuery } = resourceApi;

export default resourceApi;
