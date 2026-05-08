import styles from "./PreLogin.module.css";
import { useNavigate } from "react-router-dom";
import LinkedInIcon from "../../components/shared-components/Icons/LinkedInIcon";

export default function PreLogin() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.prelogin}>
        <LinkedInIcon
          styles={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
          }}
        />
        <div className={styles.landingForm}>
          <span className={styles.motto}>Welcome to your professional community.</span>
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
        <div className={styles.landingImg}>
          <img
            src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
            alt="img"
          />
        </div>
      </div>
    </>
  );
}
