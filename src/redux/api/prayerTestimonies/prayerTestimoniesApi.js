import api from "../api";

const prayerTestimonyApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPrayerTestimony: build.mutation({
      query: (body) => ({
        url: "/prayers-and-testimonies/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePrayerTestimonyMutation } = prayerTestimonyApi;

export default prayerTestimonyApi;
