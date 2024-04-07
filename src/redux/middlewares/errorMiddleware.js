import { toast } from "react-toastify";
import { clearTokens } from "../features/auth/tokenSlice";
import { logout } from "../features/auth/authSlice";

const errorMiddleware = (store) => (next) => (action) => {
  const isRejected = action.type.endsWith("/rejected");
  const isFulfilled = action.type.endsWith("/fulfilled");

  // check for error message
  const errorMessage =
    action.payload?.data?.error ||
    action.payload?.data?.message ||
    action.error?.message ||
    action?.error ||
    action.payload?.error ||
    "Oops, something went wrong!";

  // check if action is rejected or is fufilled but an error exists
  if ((isFulfilled && action.payload?.error) || isRejected) {
    if (errorMessage.includes("authorized") && errorMessage.includes("expire")) {
      toast.error("Session has expired. Login again");
      setTimeout(() => {
        store.dispatch(clearTokens());
        // Store the current URL in localStorage
        localStorage.setItem("redirectUrl", window.location.pathname + window.location.search);
        // //
        store.dispatch(logout());
        window.location.href = "/login";
      }, 1500);
    } else {
      toast.error(errorMessage);
    }
    // Use toast.error to show a toast with the error message
    toast.error(errorMessage);
  }

  // Pass the action to the next middleware or the reducer
  return next(action);
};

export default errorMiddleware;
