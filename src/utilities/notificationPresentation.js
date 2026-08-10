const LABELS = {
  announcement: "Announcement",
  event: "Event update",
  event_reminder: "Event reminder",
  payment_reminder: "Payment reminder",
  payment: "Payment update",
  order: "Order update",
  subscription: "Membership update",
  donation: "Donation update",
  volunteer: "Volunteer update",
  training: "Training update",
  message: "New message",
  reply: "New reply",
  custom: "CMDA update",
};

export const notificationTitle = (notification) => notification?.title || LABELS[notification?.type] || "CMDA update";

export const notificationAction = (notification) => {
  const data = notification?.data || {};
  if ((data.slug || data.eventSlug) && ["event", "event_reminder"].includes(notification?.type)) {
    return { label: "View event", to: `/dashboard/events/${data.slug || data.eventSlug}` };
  }
  if (data.orderId) return { label: "View order", to: `/dashboard/store/orders/${data.orderId}` };
  if (["payment", "payment_reminder", "subscription", "donation"].includes(notification?.type)) {
    return { label: "View payments", to: "/dashboard/payments" };
  }
  if (notification?.type === "volunteer") return { label: "View volunteering", to: "/dashboard/jobs/my-applications" };
  if (["message", "reply"].includes(notification?.type)) return { label: "Open messages", to: "/dashboard/messaging" };
  return null;
};
