import "./PreLogin.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LinkedInIcon from "../../icons/LinkedInIcon";
import { ToastContainer } from "react-toastify";
import useUserStore from "../../stores/User";

export default function PreLogin() {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const checkToken = useUserStore((state) => state.checkToken);

  useEffect(() => {
    checkToken(navigate);
  }, [isLoggedIn]);
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <div className="prelogin">
        <LinkedInIcon
          styles={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
          }}
        />
        <div className="landingForm">
          <span className="motto">Welcome to your professional community.</span>
          <br /> <br />
          <button onClick={() => navigate("/login")}>
            Sign in with email
          </button>{" "}
          <br /> <br />
          <span style={{ fontSize: "1.1rem" }}>
            New to LinkedIn?{" "}
            <a href="" onClick={() => navigate("/signup")}>
              Join now
            </a>
          </span>
        </div>
        <div className="landingImg">
          <img
            src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
            alt="img"
          />
        </div>
      </div>
    </>
  );
}
