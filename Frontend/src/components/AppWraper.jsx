// AppWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";

const AppWrapper = ({ children, handleLogout, socket }) => {
  const location = useLocation();

  // List of routes to exclude from layout
  const noLayoutRoutes = ["/", "/login", "/signup"];

  // Check if the current route is in the noLayoutRoutes list
  const useLayout = !noLayoutRoutes.includes(location.pathname);

  return useLayout ? (
    <Layout handleLogout={handleLogout} socket={socket}>
      {children}
    </Layout>
  ) : (
    <>{children}</>
  );
};

export default AppWrapper;
