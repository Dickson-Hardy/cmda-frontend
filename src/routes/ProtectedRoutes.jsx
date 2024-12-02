import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";

const ProtectedRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (isAuthenticated) {
    if (user.emailVerified) {
      dispatch(setVerifyEmail(user.email));
      return <Navigate to="/verify-email" />;
    }
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
