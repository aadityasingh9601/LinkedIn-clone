import { Outlet, Navigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

export default function PublicRoutes({ isLoggedIn, isAuthLoading }) {
  if (isAuthLoading)
    return (
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
    );
  return !isLoggedIn ? <Outlet /> : <Navigate to="/home" />;
}
