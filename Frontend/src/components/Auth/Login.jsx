import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import useUserStore from "../../stores/User";
import { useEffect } from "react";
import RHFInput from "../RHFinput";
import LinkedInIcon from "../../icons/LinkedInIcon";

export default function Login() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const checkToken = useUserStore((state) => state.checkToken);
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
    console.log(loginData);

    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",

        { loginData },

        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.request.status === 200) {
        toast.success("User logged in successfully!");
        //Storing id in our local storage to use it for the socket connection for now..

        localStorage.setItem("currUserId", response.data.id);
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
        //we removed window.location.href("/" ) from here because that may cause a full page refresh and lose your
        //component's state, and setIsLoggedIn stays the same as false.
        // Delay navigation to allow toast to display
        setTimeout(() => {
          navigate("/home");
        }, 1500); //
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  }

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
      <div className="login">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <p
            style={{
              fontSize: "2.2rem",
              textAlign: "center",
              margin: "0",
              color: "black",
            }}
          >
            Login
          </p>
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

          <br />
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
