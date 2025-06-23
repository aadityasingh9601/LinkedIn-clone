import { useForm } from "react-hook-form";
import useProfileStore from "../../stores/Profile";
import Button from "../Button.";
import RHFtextarea from "../RHFtextarea";
import RHFInput from "../RHFinput";

export default function ExperienceForm({
  experience = {},
  updateVisState,
  onSubmitProp,
}) {
  const createProfile = useProfileStore((state) => state.createProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...experience,
      started: experience?.started?.split("T")[0],
      ended: experience?.ended?.split("T")[0],
    },
  });

  const onSubmit = (experience) => {
    console.log(experience);
    createProfile({ experience }, updateVisState);
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitProp || onSubmit)}>
        <RHFInput
          placeholder="Enter company name"
          name="companyName"
          register={register}
          rules={{
            required: "Company name is required",
            minLength: {
              value: 5,
              message: "Company name should be at least 5 characters",
            },
          }}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter job title"
          name="jobTitle"
          register={register}
          rules={{
            required: "Job title is required",
            minLength: {
              value: 2,
              message: "Job title should be at least 2 characters",
            },
          }}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter start date (yyyy-mm-dd) "
          register={register}
          name="started"
          rules={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
          errors={errors}
        />

        <RHFInput
          register={register}
          name="ended"
          rules={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
          placeholder="Enter end date (yyyy-mm-dd)"
          errors={errors}
        />

        <RHFtextarea
          register={register}
          errors={errors}
          name="description"
          placeholder="Write your job description here..."
          rules={{}}
        />

        <Button btnText="Cancel" onClick={() => updateVisState(false)} />
        <Button btnText="Save" />
      </form>
    </div>
  );
}
