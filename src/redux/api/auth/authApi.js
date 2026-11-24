import api from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // LOGIN
    login: build.mutation({
      extraOptions: { handlesError: true },
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload }),
    }),
    // Sign Up
    signUp: build.mutation({
      extraOptions: { handlesError: true },
      query: (payload) => ({ url: "/auth/signup", method: "POST", body: payload }),
    }),
    // VERIFY USER
    verifyUser: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),
    // RESEND VERIFY CODE
    resendVerifyCode: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/auth/resend-verify-code", method: "POST", body }),
    }),
    // FORGOT PASSWORD
    passwordForgot: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    // RESET PASSWORD
    passwordReset: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformErrorResponse: (response) => response.data?.message,
    }),
    // LOG OUT (revoke refresh tokens/sessions on the server)
    logoutAll: build.mutation({
      extraOptions: { handlesError: false },
      query: () => ({ url: "/auth/logout-all", method: "POST" }),
    }),
    // GET SETTINGS
    getSettings: build.query({
      query: () => ({ url: "/users/settings" }),
      transformResponse: (response) => response.data,
      providesTags: ["USER_SETTINGS"],
    }),
    // UPDATE SETTINGS
    updateSettings: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/users/settings", method: "PATCH", body }),
      invalidatesTags: ["USER_SETTINGS"],
    }),
    // CHECK USER EXISTS
    checkUserExists: build.mutation({
      extraOptions: { handlesError: true },
      query: (body) => ({ url: "/auth/check-user", method: "POST", body }),
      transformResponse: (response) => response.data,
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
  useLogoutAllMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useCheckUserExistsMutation,
} = authApi;

export default authApi;
