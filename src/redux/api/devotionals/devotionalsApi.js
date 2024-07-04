import api from "../api";

const devotionalsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllDevotionals: build.query({
      query: () => "/devotionals",
      transformResponse: (response) => response.data,
      providesTags: ["DEVOTIONALS"],
    }),
    getLatestDevotional: build.query({
      query: () => ({ url: `/devotionals/latest` }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetLatestDevotionalQuery, useGetAllDevotionalsQuery } = devotionalsApi;

export default devotionalsApi;
