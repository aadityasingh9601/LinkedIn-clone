import "./Signup.css";
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
      <div className="signup">
        <p>Make the most out of your professional life</p>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <span>Your name</span>
          <br />
          <RHFInput
            type="text"
            name="name"
            register={register}
            errors={errors}
          />
          <span>Your email</span>
          <br />
          <RHFInput
            type="email"
            register={register}
            name="email"
            errors={errors}
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

          <div className="signupFormBtns">
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
        </form>
      </div>
    </>
  );
}
