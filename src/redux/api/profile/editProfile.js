import api from "../api";

const editProfile = api.injectEndpoints({
  endpoints: (build) => ({
    // edit profile
    editProfile: build.mutation({
      query: ({ id, payload }) => ({ url: `/users/${id}/update-profile`, method: "PATCH", body: payload }),

      transformErrorResponse: (response) => response.data?.message,
    }),
    // update password
    updatePassword: build.mutation({
      query: (payload) => ({ url: `users/update-password`, method: "PATCH", body: payload }),

      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useEditProfileMutation, useUpdatePasswordMutation } = editProfile;

export default editProfile;
