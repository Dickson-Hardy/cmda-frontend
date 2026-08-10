import api from "../api";

const notificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllNotifications: build.query({
      query: (params = {}) => ({ url: "/notifications", params }),
      transformResponse: (response) => response.data,
      providesTags: ["ALL_NOTIFICATIONS"],
    }),
    getNotification: build.query({
      query: (id) => ({ url: `/notifications/${id}` }),
      transformResponse: (response) => response.data,
      providesTags: (_result, _error, id) => [{ type: "ALL_NOTIFICATIONS", id }],
    }),
    getNotificationStats: build.query({
      query: () => ({ url: "/notifications/stats" }),
      transformResponse: (response) => response.data,
      providesTags: ["NOTIFICATIONS_STATS"],
    }),
    markAsRead: build.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["ALL_NOTIFICATIONS", "NOTIFICATIONS_STATS"],
    }),
    markAllAsRead: build.mutation({
      query: () => ({ url: "/notifications/mark-all-read", method: "PATCH" }),
      invalidatesTags: ["ALL_NOTIFICATIONS", "NOTIFICATIONS_STATS"],
    }),
    deleteNotification: build.mutation({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["ALL_NOTIFICATIONS", "NOTIFICATIONS_STATS"],
    }),
    restoreNotification: build.mutation({
      query: (id) => ({ url: `/notifications/${id}/restore`, method: "PATCH" }),
      invalidatesTags: ["ALL_NOTIFICATIONS", "NOTIFICATIONS_STATS"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useRestoreNotificationMutation,
  useGetNotificationStatsQuery,
} = notificationsApi;

export default notificationsApi;
