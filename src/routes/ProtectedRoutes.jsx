import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedUserType }) => {
  const { isAuthenticated, isGlobalAdmin, isSystemAdmin } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // prevent non global users from accessing global admin dashboard
    if (allowedUserType === "global-admin") {
      return isGlobalAdmin ? <Outlet /> : <Navigate to="/login" />;
    }
    // prevent non system users from accessing system admin dashboard
    if (allowedUserType === "system-admin") {
      return isSystemAdmin ? <Outlet /> : <Navigate to="/login" />;
    }
  } else {
    // send non-authenticated users to login
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
