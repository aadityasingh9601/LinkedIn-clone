import useProfileStore from "../../stores/Profile";
import Textarea from "../Textarea";
import Input from "../Input";
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
        <Input
          placeholder="Enter institution"
          register={register}
          name="institution"
          options={{
            required: "Institution is required",
            minLength: {
              value: 5,
              message: "Institution should be at least 5 characters",
            },
          }}
        />

        {errors.institution && <p>{errors.institution.message}</p>}

        <Input
          name="degree"
          placeholder="Enter degree"
          register={register}
          options={{
            required: "Degree is required",
            minLength: {
              value: 2,
              message: "Degree should be at least 2 characters",
            },
          }}
        />

        <Input
          placeholder="Enter start date (yyyy-mm-dd)"
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
          placeholder="Enter end date (yyyy-mm-dd)"
          name="ended"
          register={register}
          options={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
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
