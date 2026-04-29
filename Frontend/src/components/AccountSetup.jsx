import "./AccountSetup.css";
import Button from "./Button.";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RHFInput from "./RHFInput";
import useUserStore from "../stores/User";
import { AccountSetupDataSchema } from "../../../common/src";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AccountSetup() {
  const navigate = useNavigate();
  const currUserId = useUserStore((state) => state.currUserId);
  const setupAccount = useUserStore((state) => state.setupAccount);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AccountSetupDataSchema),
  });

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
          />
          <span>Enter your city</span>
          <br />
          <RHFInput
            type="text"
            register={register}
            name="city"
            errors={errors}
          />
          <span>Enter your country</span>
          <br />
          <RHFInput
            type="text"
            register={register}
            name="country"
            errors={errors}
          />
          <br />

          <Button type="submit" btnText="Submit" />
        </form>
      </div>
    </>
  );
}
