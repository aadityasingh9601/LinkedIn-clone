import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes({ isLoggedIn }) {
  // console.log("isLoggedIn: " + isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
