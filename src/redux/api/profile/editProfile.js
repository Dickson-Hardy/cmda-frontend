import api from "../api";

const editProfile = api.injectEndpoints({
  endpoints: (build) => ({
    // edit profile
    editProfile: build.mutation({
      query: ({ id, payload }) => ({ url: `/users/${id}/update-profile`, method: "PATCH", body: payload }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response) => response.data,
      // Pick out error and prevent nested properties when displaying error
      transformErrorResponse: (response) => response.data?.message,
    }),
    // update password
    updatePassword: build.mutation({
      query: (payload) => ({ url: `users/update-password`, method: "PATCH", body: payload }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response) => response.data,
      // Pick out error and prevent nested properties when displaying error
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useEditProfileMutation, useUpdatePasswordMutation } = editProfile;

export default editProfile;
