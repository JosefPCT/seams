//src/app/routes.jsx
// File that holds the routing paths
import { createBrowserRouter, Navigate } from "react-router";

import { LandingPage } from "../../pages/landing/index.js";
import { LoginPage } from "../../pages/login/index.js";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { GuestRoute } from "./GuestRoute.jsx";
import LogoutPage from "../../pages/logout/LogoutPage.jsx";
import { DashboardPage } from "../../pages/dashboard/index.js";

export const router =  createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage />}
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
        { index: true, element: <LandingPage /> },
        { path: '/dashboard', element: <DashboardPage />}
    ]
  },

  {
    path: '/logout',
    element: <LogoutPage />
  },
  // {
  //   path: '*',
  //   element: <Navigate to='/dashboard' replace />
  // }
]);
