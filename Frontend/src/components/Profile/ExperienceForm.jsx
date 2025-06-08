import { useForm } from "react-hook-form";
import useProfileStore from "../../stores/Profile";

import Input from "../Input";
import Button from "../Button.";
import RHFtextarea from "../RHFtextarea";

export default function ExperienceForm() {
  const createProfile = useProfileStore((state) => state.createProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = (experience) => {
    console.log(experience);
    createProfile({ experience: experience });
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Enter company name"
          name="companyName"
          register={register}
          options={{
            required: "Company name is required",
            minLength: {
              value: 5,
              message: "Company name should be at least 5 characters",
            },
          }}
        />
        {errors.companyName && <p>{errors.companyName.message}</p>}

        <Input
          placeholder="Enter job title"
          name="jobTitle"
          register={register}
          options={{
            required: "Job title is required",
            minLength: {
              value: 2,
              message: "Job title should be at least 2 characters",
            },
          }}
        />

        <Input
          placeholder="Enter start date (yyyy-mm-dd) "
          register={register}
          name="started"
          options={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
        />

        {errors.started && <p>{errors.started.message}</p>}

        <Input
          register={register}
          name="ended"
          options={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
          placeholder="Enter end date (yyyy-mm-dd)"
        />

        {errors.ended && <p>{errors.ended.message}</p>}

        <RHFtextarea
          register={register}
          errors={errors}
          name="description"
          placeholder="Write your job description here..."
          rules={{}}
        />

        <Button btnText="Cancel" onClick={() => setAddExperience(false)} />
        <Button btnText="Add" />
      </form>
    </div>
  );
}
