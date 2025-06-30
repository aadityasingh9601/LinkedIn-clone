import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import useUserStore from "../../stores/User";
import { useEffect } from "react";
import RHFInput from "../RHFInput";
import LinkedInIcon from "../../icons/LinkedInIcon";

export default function Login() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const checkToken = useUserStore((state) => state.checkToken);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Check for refresh token because if refresh token is there, new access token will be created, but if refresh
  //token is not there, the user must login again.
  useEffect(() => {
    checkToken(navigate);
  }, [isLoggedIn]);

  async function onSubmit(loginData) {
    login(loginData, navigate);
  }

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <LinkedInIcon />
      <div className="login">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <p>Login</p>
          <span>Your email</span>
          <br />
          <RHFInput
            type="email"
            name="email"
            errors={errors}
            register={register}
            rules={{
              required: "Email is required!",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Email is not valid",
              },
            }}
          />

          <span>Your password</span>
          <br />
          <RHFInput
            type="password"
            register={register}
            name="password"
            rules={{
              required: "Password is required!",
              minLength: {
                value: 3,
                message: "Password must be at least 3 characters",
              },
            }}
            errors={errors}
          />
          <br />
          <button className="nav-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
