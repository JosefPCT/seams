//src/app/routes.jsx
import MainWrapper from "./provider/MainWrapper.jsx";
import { LandingPage } from "../pages/landing";

const routes = [
  {
    Component: MainWrapper,
    children: [
        { index: true, Component: LandingPage },
    ]
  },
];

export default routes;