import "./Signup.css";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RHFInput from "../RHFInput";
import LinkedInIcon from "../../icons/LinkedInIcon";
import useUserStore from "../../stores/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupDataSchema } from "../../../../common/src";

//We don't use controlled components while using our react-hook-form library, else it compromises with the performance and other benefits
//provided by the library.

export default function Signup() {
  const navigate = useNavigate();
  const signUp = useUserStore((state) => state.signUp);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupDataSchema),
  });

  const onSubmit = async (signupData) => {
    const res = await signUp(signupData, navigate);
    console.log(res);
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

          <Button type="submit" btnText="SignUp" />
          <Button
            btnText="Existing account? Log in!"
            onClick={() => {
              navigate("/login");
            }}
          />
        </form>
      </div>
    </>
  );
}
