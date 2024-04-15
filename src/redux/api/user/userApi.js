import api from "../api";

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: ({ searchText, page, limit }) => ({
        url: "/users",
        params: {
          ...(searchText ? { searchText } : {}),
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
        },
      }),
    }),
    getSingleUser: build.query({
      query: (id) => `/users/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery } = userApi;

export default userApi;
