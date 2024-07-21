import api from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // LOGIN
    login: build.mutation({
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload }),
    }),
    // Sign Up
    signUp: build.mutation({
      query: (payload) => ({ url: "/auth/signup", method: "POST", body: payload }),
    }),
    // VERIFY USER
    verifyUser: build.mutation({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),
    // RESEND VERIFY CODE
    resendVerifyCode: build.mutation({
      query: (body) => ({ url: "/auth/resend-verify-code", method: "POST", body }),
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
    // GET SETTINGS
    getSettings: build.query({
      query: () => ({ url: "/users/settings" }),
      transformResponse: (response) => response.data,
      providesTags: ["USER_SETTINGS"],
    }),
    // UPDATE SETTINGS
    updateSettings: build.mutation({
      query: (body) => ({ url: "/users/settings", method: "PATCH", body }),
      invalidatesTags: ["USER_SETTINGS"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  usePasswordForgotMutation,
  usePasswordResetMutation,
  useVerifyUserMutation,
  useResendVerifyCodeMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = authApi;

export default authApi;
