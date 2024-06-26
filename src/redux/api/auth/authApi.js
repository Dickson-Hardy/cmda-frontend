import api from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // LOGIN
    login: build.mutation({
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response) => response.data,
      // Pick out error and prevent nested properties when displaying error
      // transformErrorResponse: (response) => response.data?.message,
    }),
    // Sign Up
    signUp: build.mutation({
      query: (payload) => ({ url: "/auth/signup", method: "POST", body: payload }),
    }),
    // VERIFY USER
    verifyUser: build.mutation({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),
    // FORGOT PASSWORD
    passwordForgot: build.mutation({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    // RESET PASSWORD
    passwordReset: build.mutation({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  usePasswordForgotMutation,
  usePasswordResetMutation,
  useVerifyUserMutation,
} = authApi;

export default authApi;
