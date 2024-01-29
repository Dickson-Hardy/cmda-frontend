import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorElement from "./ErrorElement/ErrorElement";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout";
import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";
import EmptyLayout from "~/layouts/EmptyLayout/EmptyLayout";
import WelcomePage from "~/pages/Welcome";
import Dashboard from "~/pages/Dashboard/Dashboard";
import Login from "~/pages/Auth/Login/Login";
import ForgotPassword from "~/pages/Auth/ForgotPassword/ForgotPassword";
import NewPassword from "~/pages/Auth/NewPassword/NewPassword";

export default function AppRouter() {
  // routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EmptyLayout />,
      children: [
        { path: "", element: <WelcomePage /> },
        { path: "welcome", element: <WelcomePage /> },
        // Auth pages
        {
          element: <AuthLayout />,
          children: [
            { path: "login", element: <Login /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <NewPassword /> },
          ],
        },
        // Dashboard Pages
        {
          element: <DashboardLayout />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "events", element: <h1>All Events</h1> },
          ],
        },
      ],
      errorElement: (
        <EmptyLayout>
          <ErrorElement />,
        </EmptyLayout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
