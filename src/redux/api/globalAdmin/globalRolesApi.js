import api from "../api";

const globalRolesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // CREATE ROLE
    createRole: build.mutation({
      query: (payload) => ({ url: "/roles", method: "POST", body: payload }),
    }),
    // GET ORGANIZATION
    getRoles: build.query({
      query: ({ searchBy, limit, page }) => ({
        url: `/roles?searchBy=${searchBy}&limit=${limit}&page=${page}`,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateRoleMutation, useGetRolesQuery } = globalRolesApi;

export default globalRolesApi;
