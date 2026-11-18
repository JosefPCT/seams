//src/app/routes.jsx
import MainWrapper from "./provider/MainWrapper.jsx";
import { LandingPage } from "../pages/landing";
import ProtectedRoute from "../app/context/ProtectedRoute.jsx";

const routes = [
  {
    Component: ProtectedRoute,
    children: [
        { index: true, Component: LandingPage },
    ]
  },
];

export default routes;