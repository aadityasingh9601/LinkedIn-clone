import { useForm } from "react-hook-form";
import useProfileStore from "../../stores/Profile";
import Textarea from "../Textarea";
import Button from "../Button.";

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
        <input
          placeholder="Enter company name"
          {...register("companyName", {
            required: "Company name is required",
            minLength: {
              value: 5,
              message: "Company name should be at least 5 characters",
            },
          })}
        />
        {errors.companyName && <p>{errors.companyName.message}</p>}

        <input
          placeholder="Enter job title"
          {...register("jobTitle", {
            required: "Job title is required",
            minLength: {
              value: 2,
              message: "Job title should be at least 2 characters",
            },
          })}
        />

        <input
          placeholder="Enter start date (yyyy-mm-dd) "
          {...register("started", {
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          })}
        />

        {errors.started && <p>{errors.started.message}</p>}

        <input
          placeholder="Enter end date (yyyy-mm-dd)"
          {...register("ended", {
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          })}
        />

        {errors.ended && <p>{errors.ended.message}</p>}

        <Textarea
          placeholder="Write your job description here..."
          name="description"
          register={register}
        />

        <Button btnText="Cancel" onClick={() => setAddExperience(false)} />
        <Button btnText="Add" />
      </form>
    </div>
  );
}
