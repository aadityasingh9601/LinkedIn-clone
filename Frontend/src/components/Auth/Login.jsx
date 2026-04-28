import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import useUserStore from "../../stores/User";
import { useEffect } from "react";
import RHFInput from "../RHFInput";
import LinkedInIcon from "../../icons/LinkedInIcon";
import Button from "../Button.";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDataSchema } from "../../../../common/src";

export default function Login() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginDataSchema),
  });

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
          />

          <span>Your password</span>
          <br />
          <RHFInput
            type="password"
            register={register}
            name="password"
            errors={errors}
          />
          <br />
          <button className="nav-btn" type="submit">
            Login
          </button>
          <Button
            btnText="No account? Signup!"
            onClick={() => {
              navigate("/signup");
            }}
          />
        </form>
      </div>
    </>
  );
}
