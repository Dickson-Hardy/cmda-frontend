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
    // update profile Picture
    updateProfilePicture: build.mutation({
      query: ({ id, payload }) => ({ url: `/users/${id}/update-profile-image`, method: "POST", body: payload }),

      transformErrorResponse: (response) => response.data?.message,
    }),
    updateProfilePicture2: build.mutation({
      query: ({ id, payload }) => ({ url: `/users/${id}/update-profile-image`, method: "POST", body: payload }),

      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const {
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useUpdateProfilePicture2Mutation,
} = editProfile;

export default editProfile;
