import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useUserStore from "../../stores/User";
import RHFInput from "../../components/shared-components/Inputs/RHFInput";
import LinkedInIcon from "../../components/shared-components/Icons/LinkedInIcon";
import Button from "../../components/shared-components/Buttons/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDataSchema } from "../../zodSchema";
import Spinner from "../../components/shared-components/Loaders/Spinner";
import { useState } from "react";

export default function Login() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginDataSchema),
  });

  async function onSubmit(loginData) {
    login(loginData, navigate, setIsLoading);
  }

  return (
    <>
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
          <div className="loginFormBtns">
            <Button
              type="submit"
              disabled={isLoading}
              btnText={isLoading ? <Spinner /> : "Login"}
            />
            <Button
              btnText="No account? Signup!"
              onClick={() => {
                navigate("/signup");
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
