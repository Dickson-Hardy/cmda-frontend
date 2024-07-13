import api from "../api";

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: ({ searchBy, page, limit, role, region }) => ({
        url: "/users",
        params: {
          page,
          limit,
          ...(searchBy ? { searchBy } : {}),
          ...(role ? { role } : {}),
          ...(region ? { region } : {}),
        },
      }),
      transformResponse: (response) => response.data,
    }),
    getSingleUser: build.query({
      query: (memId) => `/users/${memId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery } = userApi;

export default userApi;
