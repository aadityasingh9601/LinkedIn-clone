import "./Signup.css";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RHFInput from "../RHFInput";
import LinkedInIcon from "../../icons/LinkedInIcon";
import useUserStore from "../../stores/User";

//We don't use controlled components while using our react-hook-form library, else it compromises with the performance and other benefits
//provided by the library.

export default function Signup() {
  const navigate = useNavigate();
  const signUp = useUserStore((state) => state.signUp);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (signupData) => {
    //console.log(signupData)
    signUp(signupData, navigate);
  };

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
            rules={{ required: "Name is required" }}
          />
          <span>Your email</span>
          <br />
          <RHFInput
            type="email"
            register={register}
            name="email"
            errors={errors}
            rules={{
              required: "Email is required",
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
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password must be at least 3 characters",
              },
            }}
            errors={errors}
          />
          <br />

          <Button type="submit" btnText="SignUp" />
        </form>
      </div>
    </>
  );
}
