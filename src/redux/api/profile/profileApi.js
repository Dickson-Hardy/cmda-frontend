import api from "../api";

const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({ url: `/auth/me` }),
      transformResponse: (response) => response.data,
    }),
    // edit profile
    editProfile: build.mutation({
      query: (payload) => ({ url: `/auth/me`, method: "PATCH", body: payload }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    // update password
    updatePassword: build.mutation({
      query: (payload) => ({ url: `/auth/change-password`, method: "PATCH", body: payload }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    getTransition: build.query({
      query: () => ({ url: `/users/transition` }),
      transformResponse: (response) => response?.data,
      providesTags: ["TRANSIT"],
    }),
    createUpdateTransition: build.mutation({
      query: (body) => ({ url: `/users/transition`, method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
      invalidatesTags: ["TRANSIT"],
    }),
  }),
});

export const {
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetTransitionQuery,
  useCreateUpdateTransitionMutation,
  useGetProfileQuery,
} = profileApi;

export default profileApi;
