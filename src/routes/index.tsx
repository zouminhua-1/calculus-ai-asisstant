import { createBrowserRouter } from "react-router";
import Registry from "@/pages/signIn/page";
import Home from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
import Root from "@/pages/auth/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [{ index: true, path: "home", element: <Home /> }],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/registry",
    Component: Registry,
  },
]);

export default router;
