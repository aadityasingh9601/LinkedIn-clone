import useProfileStore from "../../stores/Profile";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import RHFtextarea from "../RHFtextarea";
import RHFInput from "../RHFinput";

export default function EducationForm({
  education = {},
  updateVisState,
  onSubmitProp,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...education,
      started: education?.started?.split("T")[0],
      ended: education?.ended?.split("T")[0],
    },
  });

  const createProfile = useProfileStore((state) => state.createProfile);

  const onSubmit = (education) => {
    console.log(education);
    createProfile({ education: education });
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitProp || onSubmit)}>
        <RHFInput
          placeholder="Enter institution"
          register={register}
          name="institution"
          rules={{
            required: "Institution is required",
            minLength: {
              value: 5,
              message: "Institution should be at least 5 characters",
            },
          }}
          errors={errors}
        />

        <RHFInput
          name="degree"
          placeholder="Enter degree"
          register={register}
          rules={{
            required: "Degree is required",
            minLength: {
              value: 2,
              message: "Degree should be at least 2 characters",
            },
          }}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter start date (yyyy-mm-dd)"
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
          placeholder="Enter end date (yyyy-mm-dd)"
          name="ended"
          register={register}
          rules={{
            required: "Date is required",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Date must be in yyyy-mm-dd format",
            },
          }}
          errors={errors}
        />

        <RHFtextarea
          register={register}
          errors={errors}
          name="description"
          placeholder="Add some more details..."
          rules={{}}
        />

        <Button btnText="Cancel" onClick={() => updateVisState(false)} />
        <Button btnText="Add" />
      </form>
    </div>
  );
}
