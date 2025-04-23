import useProfileStore from "../../stores/Profile";
import Textarea from "../Textarea";
import Button from "../Button.";
import { useForm } from "react-hook-form";

export default function EducationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = (education) => {
    console.log(education);
    createProfile({ education: education });
    reset();
  };

  const createProfile = useProfileStore((state) => state.createProfile);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Enter institution"
          {...register("institution", {
            required: "Institution is required",
            minLength: {
              value: 5,
              message: "Institution should be at least 5 characters",
            },
          })}
        />
        {errors.institution && <p>{errors.institution.message}</p>}

        <input
          placeholder="Enter degree"
          {...register("degree", {
            required: "Degree is required",
            minLength: {
              value: 2,
              message: "Degree should be at least 2 characters",
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
          placeholder="Add some more details..."
          name="description"
          register={register}
        />

        {errors.description && <p>{errors.description.message}</p>}

        <Button btnText="Cancel" onClick={() => setAddEducation(false)} />
        <Button btnText="Add" />
      </form>
    </div>
  );
}
