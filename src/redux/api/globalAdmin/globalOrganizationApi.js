import api from "../api";

const globalOrganizationApi = api.injectEndpoints({
  endpoints: (build) => ({
    // CREATE ORGANIZATION
    createGlobalOrganization: build.mutation({
      query: (payload) => ({ url: "/organizations", method: "POST", body: payload }),
    }),
    // GET ORGANIZATION
    getGlobalOrganization: build.query({
      query: ({ searchBy, limit, page }) => ({
        url: `/organizations/all?searchBy=${searchBy}&limit=${limit}&page=${page}`,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateGlobalOrganizationMutation, useGetGlobalOrganizationQuery } =
  globalOrganizationApi;

export default globalOrganizationApi;
