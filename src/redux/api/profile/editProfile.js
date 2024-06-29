import api from "../api";

const editProfile = api.injectEndpoints({
  endpoints: (build) => ({
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
    // update profile Picture
    updateProfilePicture: build.mutation({
      query: ({ id, payload }) => ({ url: `/users/${id}/update-profile-image`, method: "POST", body: payload }),
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useEditProfileMutation, useUpdatePasswordMutation, useUpdateProfilePictureMutation } = editProfile;

export default editProfile;
