import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";

const ProtectedRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  if (isAuthenticated) {
    if (!user.emailVerified) {
      dispatch(setVerifyEmail(user.email));
      return <Navigate to="/verify-email" />;
    }
    
    // Check if user needs to change their temporary password
    // Allow access to change-password page, but redirect from other pages
    if (user.requirePasswordChange && location.pathname !== "/change-password") {
      return <Navigate to="/change-password" />;
    }
    
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
