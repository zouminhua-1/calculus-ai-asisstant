import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function RootAuth() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <Outlet />
    </div>
  );
}
