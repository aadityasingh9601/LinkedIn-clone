import "./AccountSetup.css";
import Button from "./Button.";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RHFInput from "./RHFInput";
import useUserStore from "../stores/User";

export default function AccountSetup() {
  const navigate = useNavigate();
  const currUserId = useUserStore((state) => state.currUserId);
  const setupAccount = useUserStore((state) => state.setupAccount);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (setupData) => {
    console.log(setupData);
    const res = await setupAccount(currUserId, setupData, navigate);
    console.log(res);
  };
  return (
    <>
      <div className="accountsetup">
        <p>Finish setting up your account</p>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <span>Enter your phone number</span>
          <br />
          <RHFInput
            type="text"
            name="phone"
            register={register}
            errors={errors}
            rules={{ required: "Phone is required" }}
          />
          <span>Enter your city</span>
          <br />
          <RHFInput
            type="text"
            register={register}
            name="city"
            errors={errors}
            rules={{
              required: "City is required",
            }}
          />
          <span>Enter your country</span>
          <br />
          <RHFInput
            type="text"
            register={register}
            name="country"
            rules={{
              required: "Country is required",
              minLength: {
                value: 3,
                message: "Country must be at least 3 characters",
              },
            }}
            errors={errors}
          />
          <br />

          <Button type="submit" btnText="Submit" />
        </form>
      </div>
    </>
  );
}
