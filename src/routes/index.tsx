import { createBrowserRouter } from "react-router";
import Registry from "@/pages/signIn/page";
import Home from "@/components/Home"; // 聊天主页面
import AuthPage from "@/pages/login/page";

const router = createBrowserRouter([
  {
    path: "/",
    // 根路径根据是否登录跳转，这里演示直接进入聊天或登录
    element: <Home />,
  },
  {
    path: "/registry",
    element: <Registry onBack={() => {}} />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
]);

export default router;
