import styles from "./Login.module.css";
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
import FormWrapper from "../../components/shared-components/Forms/FormWrapper";

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
      <div className={styles.login}>
        <FormWrapper onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p>Login</p>
          <RHFInput
            label="Your email"
            type="email"
            name="email"
            customClass={styles.customInput}
            errors={errors}
            register={register}
          />

          <RHFInput
            label="Your password"
            type="password"
            register={register}
            customClass={styles.customInput}
            name="password"
            errors={errors}
          />

          <div className={`${styles.loginFormBtns}`}>
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
        </FormWrapper>
      </div>
    </>
  );
}
