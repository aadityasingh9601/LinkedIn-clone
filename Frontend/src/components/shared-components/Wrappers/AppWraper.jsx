import { useLocation } from "react-router-dom";
import { Suspense } from "react";
import Layout from "../Layouts/Layout";
import AuthLayout from "../Layouts/AuthLayout";
import { ThreeDots } from "react-loader-spinner";

const AppWrapper = ({ children, socket }) => {
  const location = useLocation();
  const noLayoutRoutes = ["/", "/login", "/signup"];
  const useLayout = !noLayoutRoutes.includes(location.pathname);

  return useLayout ? (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ThreeDots
            visible={true}
            height={80}
            width={80}
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      }
    >
      <Layout socket={socket}>{children}</Layout>
    </Suspense>
  ) : (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ThreeDots
            visible={true}
            height={80}
            width={80}
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      }
    >
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  );
};

export default AppWrapper;
