import "./Signup.css";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RHFInput from "../RHFinput";
import LinkedInIcon from "../../icons/LinkedInIcon";

//We don't use controlled components while using our react-hook-form library, else it compromises with the performance and other benefits
//provided by the library.

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (signupData) => {
    console.log(signupData);

    try {
      const response = await axios.post("http://localhost:8000/users/signup", {
        signupData,
      });
      console.log(response.request.status);
      if (response.request.status === 200) {
        toast.success(response.data.message);
      }
      setTimeout(() => {
        navigate("/login"); // Navigate to home page.
      }, 2000); // 2-second delay for the toast to appear

      // Redirect to login page after successful signup.
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  };
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
      <LinkedInIcon />

      <div className="signup">
        <p style={{ fontSize: "2.2rem", textAlign: "center", color: "black" }}>
          Make the most out of your professional life
        </p>
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
