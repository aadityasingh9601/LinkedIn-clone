import styles from "./Auth.module.css";
import Button from "../../components/shared-components/Buttons/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RHFInput from "../../components/shared-components/Inputs/RHFInput";
import LinkedInIcon from "../../components/shared-components/Icons/LinkedInIcon";
import useUserStore from "../../stores/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupDataSchema } from "../../zodSchema";
import Spinner from "../../components/shared-components/Loaders/Spinner";
import { useState } from "react";
import FormWrapper from "../../components/shared-components/Forms/FormWrapper";
//We don't use controlled components while using our react-hook-form library, else it compromises with the performance and other benefits
//provided by the library.

export default function Signup() {
  const navigate = useNavigate();
  const signUp = useUserStore((state) => state.signUp);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupDataSchema),
  });

  const onSubmit = async (signupData) => {
    await signUp(signupData, navigate, setIsLoading);
  };

  return (
    <>
      <LinkedInIcon />
      <div className={styles.page}>
        <FormWrapper onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p>Signup</p>

          <RHFInput
            label="Your name"
            type="text"
            name="name"
            customClass={styles.customInput}
            register={register}
            errors={errors}
          />

          <RHFInput
            label="Your email"
            type="email"
            customClass={styles.customInput}
            register={register}
            name="email"
            errors={errors}
          />

          <RHFInput
            label="Your password"
            type="password"
            customClass={styles.customInput}
            register={register}
            name="password"
            errors={errors}
          />

          <div className={styles.formBtns}>
            <Button
              type="submit"
              disabled={isLoading}
              btnText={isLoading ? <Spinner /> : "SignUp"}
            />
            <Button
              btnText="Existing account? Log in!"
              onClick={() => {
                navigate("/login");
              }}
            />
          </div>
        </FormWrapper>
      </div>
    </>
  );
}
