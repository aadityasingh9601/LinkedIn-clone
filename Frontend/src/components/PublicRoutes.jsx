import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoutes({ isLoggedIn, isSetupComplete }) {
  return !isLoggedIn ? (
    <Outlet />
  ) : isLoggedIn && !isSetupComplete ? (
    <Navigate to="/setup" />
  ) : (
    <Navigate to="/home" />
  );
}
