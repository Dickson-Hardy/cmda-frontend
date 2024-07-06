import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import DashboardMessagingPage from "~/pages/Dashboard/Messaging/Messaging";
import DashboardStorePage from "~/pages/Dashboard/Store/Store";
import DashboardStoreSingleProductPage from "~/pages/Dashboard/Store/SingleProduct/SingleProduct";
import DashboardStoreSingleEventPage from "~/pages/Dashboard/Events/SingleEvent/SingleEvent";
import DashboardEditProfile from "~/pages/Dashboard/Profile/EditProfile/EditProfile";
import DashboardCartPage from "~/pages/Dashboard/Store/Cart/Cart";
import DashboardVolunteersPage from "~/pages/Dashboard/Volunteers/Volunteers";
import DashboardVolunteerDetailsPage from "~/pages/Dashboard/Volunteers/VolunteerDetails/VolunteerDetails";
import DashboardCheckoutPage from "~/pages/Dashboard/Store/Cart/Checkout";
import DashboardMembersPage from "~/pages/Dashboard/Members/Members";
import DashboardMemberDetailsPage from "~/pages/Dashboard/Members/MemberDetails/MemberDetails";
import IndexPage from "~/pages/IndexPage/IndexPage";
import { useSelector } from "react-redux";
import { selectAuth } from "~/redux/features/auth/authSlice";
import DashboardPaymentsPage from "~/pages/Dashboard/Payments/Payments";
import DashboardStoreOrderHistoryPage from "~/pages/Dashboard/Store/OrderHistory/OrderHistory";
import DashboardSettingsPage from "~/pages/Dashboard/Settings/Settings";
import SingleResource from "~/pages/Dashboard/Resources/SingleResource";
import PaymentSuccessful from "~/pages/Dashboard/Payments/PaymentSuccessful";
import OrderSuccessful from "~/pages/Dashboard/Store/OrderHistory/OrderSuccessful";

export default function AppRouter() {
  const { isAuthenticated } = useSelector(selectAuth);

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
    {
      element: <EmptyLayout />,
      children: [
        { path: "/", element: <IndexPage /> },
        { path: "/welcome", element: <WelcomePage /> },
      ],
      errorElement: <ErrorDisplay />,
    },
    {
      element: <AuthLayout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <NewPassword /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/verify-email", element: <EmailVerification /> },
      ],
      errorElement: <ErrorDisplay />,
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/dashboard/",
          element: <DashboardLayout />,
          children: [
            { index: true, element: <DashboardHomePage /> },
            { path: "events", element: <DashboardEventsPage /> },
            { path: "events/:slug", element: <DashboardStoreSingleEventPage /> },
            { path: "profile", element: <DashboardProfilePage /> },
            { path: "resources", element: <DashboardResources /> },
            { path: "resources/:slug", element: <SingleResource /> },
            { path: "messaging", element: <DashboardMessagingPage /> },
            { path: "store", element: <DashboardStorePage /> },
            { path: "store/cart", element: <DashboardCartPage /> },
            { path: "store/checkout", element: <DashboardCheckoutPage /> },
            { path: "store/orders", element: <DashboardStoreOrderHistoryPage /> },
            { path: "store/orders/successful", element: <OrderSuccessful /> },
            { path: "store/:slug", element: <DashboardStoreSingleProductPage /> },
            { path: "volunteers", element: <DashboardVolunteersPage /> },
            { path: "volunteer/:id", element: <DashboardVolunteerDetailsPage /> },
            { path: "members", element: <DashboardMembersPage /> },
            { path: "members/:id", element: <DashboardMemberDetailsPage /> },
            { path: "update-password", element: <DashboardUpdatePassword /> },
            { path: "edit-profile", element: <DashboardEditProfile /> },
            { path: "payments", element: <DashboardPaymentsPage /> },
            { path: "payments/successful", element: <PaymentSuccessful /> },
            { path: "settings", element: <DashboardSettingsPage /> },
          ],
          errorElement: <ErrorDisplay />,
        },
      ],
      errorElement: <ErrorDisplay />,
    },
  ]);

  return <RouterProvider router={router} />;
}
