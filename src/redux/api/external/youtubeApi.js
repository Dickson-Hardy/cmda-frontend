import api from "../api";

const youtubeBaseUrl = import.meta.env.VITE_YOUTUBE_API_URL;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const youtubeChannelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

const youtubeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllVideos: build.query({
      query: ({ maxResults }) => ({
        url: youtubeBaseUrl + "/search",
        params: {
          key: youtubeApiKey,
          channelId: youtubeChannelId,
          maxResults,
          part: "snippert,id",
          order: "date",
          _fields: "",
        },
      }),
      transformResponse: (posts, meta) => {
        const totalPages = meta.response.headers.get("x-wp-totalpages");
        const totalItems = meta.response.headers.get("x-wp-total");
        return { posts, totalItems, totalPages };
      },
    }),
    // getSinglePost: build.query({
    //   query: ({ slug }) => wordpressBaseUrl + "/posts?slug=" + slug,
    //   transformResponse: (posts) => posts[0],
    // }),
  }),
});

export const { useGetAllVideosQuery } = youtubeApi;

export default youtubeApi;
