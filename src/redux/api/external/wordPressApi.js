import api from "../api";

const wordpressBaseUrl = import.meta.env.VITE_WORDPRESS_API_URL;

const wordPressApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllPosts: build.query({
      query: ({ page, perPage }) => ({
        url: wordpressBaseUrl + "/posts",
        params: {
          page,
          per_page: perPage,
          _fields: "id,title,slug,date,yoast_head_json.description,yoast_head_json.og_image",
        },
      }),
      transformResponse: (posts, meta) => {
        const totalPages = meta.response.headers.get("x-wp-totalpages");
        const totalItems = meta.response.headers.get("x-wp-total");
        return { posts, totalItems, totalPages };
      },
    }),
    getSinglePost: build.query({
      query: ({ slug }) => wordpressBaseUrl + "/posts?slug=" + slug + "&_embed",
      transformResponse: (posts) => posts[0],
    }),
  }),
});

export const { useGetAllPostsQuery, useGetSinglePostQuery } = wordPressApi;

export default wordPressApi;
