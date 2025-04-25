// AppWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";
import Layout from "./Layout";

const AppWrapper = ({ children, handleLogout, socket }) => {
  const location = useLocation();

  // List of routes to exclude from layout
  const noLayoutRoutes = ["/", "/login", "/signup"];

  // Check if the current route is in the noLayoutRoutes list
  const useLayout = !noLayoutRoutes.includes(location.pathname);

  return useLayout ? (
    <Suspense
      fallback={
        <h1 style={{ position: "absolute", top: "20rem", left: "50rem" }}>
          Loading...
        </h1>
      }
    >
      <Layout handleLogout={handleLogout} socket={socket}>
        {children}
      </Layout>
    </Suspense>
  ) : (
    <Suspense
      fallback={
        <h1 style={{ position: "absolute", top: "20rem", left: "50rem" }}>
          Loading...
        </h1>
      }
    >
      <>{children}</>
    </Suspense>
  );
};

export default AppWrapper;
