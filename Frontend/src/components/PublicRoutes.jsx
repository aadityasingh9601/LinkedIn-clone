import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoutes({ isLoggedIn }) {
  return !isLoggedIn ? <Outlet /> : <Navigate to="/home" />;
}
