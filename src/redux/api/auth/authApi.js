import api from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // LOGIN
    login: build.mutation({
      query: (payload) => ({ url: "/users/login", method: "POST", body: payload }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response) => response.data,
      // Pick out error and prevent nested properties when displaying error
      // transformErrorResponse: (response) => response.data?.message,
    }),
    // Sign Up
    signUp: build.mutation({
      query: (payload) => ({ url: "/users/create", method: "POST", body: payload }),
    }),
    // FORGOT PASSWORD
    passwordForgot: build.mutation({
      query: (body) => ({ url: "/password/forgot", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    // RESET PASSWORD
    passwordReset: build.mutation({
      query: (body) => ({ url: "/password/reset", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation, usePasswordForgotMutation, usePasswordResetMutation } = authApi;

export default authApi;
