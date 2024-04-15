import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorElement from "./ErrorElement/ErrorElement";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout";
import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";
import EmptyLayout from "~/layouts/EmptyLayout/EmptyLayout";
import WelcomePage from "~/pages/Welcome";
import Login from "~/pages/Auth/Login/Login";
import ForgotPassword from "~/pages/Auth/ForgotPassword/ForgotPassword";
import NewPassword from "~/pages/Auth/NewPassword/NewPassword";
import SignUp from "~/pages/Auth/SignUp/SignUp";
import EmailVerification from "~/pages/Auth/EmailVerification/EmailVerification";
import DashboardHomePage from "~/pages/Dashboard/Home/Home";
import DashboardEventsPage from "~/pages/Dashboard/Events/Events";
import DashboardProfilePage from "~/pages/Dashboard/Profile/Profile";
import ProtectedRoutes from "./ProtectedRoutes";
import DashboardResources from "~/pages/Dashboard/Resources/Resources";
import DashboardUpdatePassword from "~/pages/Dashboard/Profile/UpdatePassword/UpdatePassword";
import DashboardResourceDetails from "~/pages/Dashboard/Resources/ResourceDetails/ResourceDetails";
import DashboardMessagingPage from "~/pages/Dashboard/Messaging/Messaging";
import DashboardStorePage from "~/pages/Dashboard/Store/Store";
import DashboardStoreSingleProductPage from "~/pages/Dashboard/Store/SingleProduct/SingleProduct";
import DashboardStoreSingleEventPage from "~/pages/Dashboard/Events/SingleEvent/SingleEvent";
import DashboardEditProfile from "~/pages/Dashboard/Profile/EditProfile/EditProfile";
import DashboardCartPage from "~/pages/Dashboard/Store/Cart/Cart";
import DashboardVolunteersPage from "~/pages/Dashboard/Volunteers/Volunteers";
import DashboardVolunteerDetailsPage from "~/pages/Dashboard/Volunteers/VolunteerDetails/VolunteerDetails";
import DashboardCheckoutPage from "~/pages/Dashboard/Store/Cart/Checkout";

export default function AppRouter() {
  const isAuthenticated = true;

  // Use different layout to display error depending on authentication status
  const ErrorDisplay = () => {
    return isAuthenticated ? (
      <DashboardLayout withOutlet={false}>
        <ErrorElement />
      </DashboardLayout>
    ) : (
      <AuthLayout withOutlet={false}>
        <ErrorElement />
      </AuthLayout>
    );
  };

  // ================= ROUTES ======================= //
  const router = createBrowserRouter([
    // Dashboard Pages
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            { index: true, element: <DashboardHomePage /> },
            { path: "events", element: <DashboardEventsPage /> },
            { path: "events/:id", element: <DashboardStoreSingleEventPage /> },
            { path: "profile", element: <DashboardProfilePage /> },
            { path: "resources", element: <DashboardResources /> },
            { path: "resources/:category", element: <Navigate to="/resources" /> },
            { path: "resources/:category/:slug", element: <DashboardResourceDetails /> },
            { path: "messaging", element: <DashboardMessagingPage /> },
            { path: "store", element: <DashboardStorePage /> },
            { path: "store/cart", element: <DashboardCartPage /> },
            { path: "store/checkout", element: <DashboardCheckoutPage /> },
            { path: "store/:id", element: <DashboardStoreSingleProductPage /> },
            { path: "volunteers", element: <DashboardVolunteersPage /> },
            { path: "volunteer/:id", element: <DashboardVolunteerDetailsPage /> },
            { path: "update-password", element: <DashboardUpdatePassword /> },
            { path: "edit-profile", element: <DashboardEditProfile /> },
          ],
        },
      ],
      errorElement: <ErrorDisplay />,
    },
    // Auth pages
    {
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password", element: <NewPassword /> },
        { path: "signup", element: <SignUp /> },
        { path: "verify-email", element: <EmailVerification /> },
      ],
    },
    // Others
    {
      element: <EmptyLayout />,
      children: [{ path: "welcome", element: <WelcomePage /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}
