export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const message =
    typeof error === "string" ? error : (error?.data?.message ?? error?.data?.error ?? error?.error ?? error?.message);

  if (Array.isArray(message)) {
    const combinedMessage = message.filter(Boolean).join(", ");
    return combinedMessage || fallback;
  }

  return typeof message === "string" && message.trim() ? message : fallback;
};
