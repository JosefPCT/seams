//src/app/routes.jsx
import MainWrapper from "./provider/MainWrapper.jsx";
import { LandingPage } from "../pages/landing";
import { LoginPage } from "../pages/login/index.js";
import { ProtectedRoute } from "./routing/ProtectedRoute.jsx";
import LogoutPage from "../pages/logout/LogoutPage.jsx";
import { DashboardPage } from "../pages/dashboard/index.js";

const routes = [
  {
    Component: ProtectedRoute,
    children: [
        { index: true, Component: LandingPage },
        { path: '/dashboard', Component: DashboardPage}
    ]
  },
  {
    path: '/login',
    Component: LoginPage, 
  },
  {
    path: '/logout',
    Component: LogoutPage
  }
];

export default routes;