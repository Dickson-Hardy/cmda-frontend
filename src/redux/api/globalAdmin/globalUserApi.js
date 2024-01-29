import api from "../api";

const globalUserApi = api.injectEndpoints({
  endpoints: (build) => ({
    // CREATE GLOBAL USER
    createGlobalUser: build.mutation({
      query: (payload) => ({ url: "/users/global-admin", method: "POST", body: payload }),
    }),
    // GET GLOBAL USER
    getGlobalUser: build.query({
      query: () => ({ url: "/users/global-admin" }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateGlobalUserMutation, useGetGlobalUserQuery } = globalUserApi;

export default globalUserApi;
