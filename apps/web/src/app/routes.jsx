//src/app/routes.jsx
import MainWrapper from "./provider/MainWrapper.jsx";
import { LandingPage } from "../pages/landing";
import LoginPage from "../pages/login/LoginPage.jsx";
import ProtectedRoute from "../app/context/ProtectedRoute.jsx";
import LogoutPage from "../pages/logout/LogoutPage.jsx";

const routes = [
  {
    Component: ProtectedRoute,
    children: [
        { index: true, Component: LandingPage },
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