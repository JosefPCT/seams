// The file that `main.jsx` will call on to show all the possible routes for the entire application

import { RouterProvider } from "react-router";
import { router } from "./routing/router";

export function App() {
  return <RouterProvider router={router} />
}