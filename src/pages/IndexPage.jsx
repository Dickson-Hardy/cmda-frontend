import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const IndexPage = () => {
  const { isGlobalAdmin, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (isGlobalAdmin) return <Navigate to="/global-admin" />;
    else return <Navigate to="/system-admin" />;
  } else {
    return <Navigate to="/login" />;
  }
};
