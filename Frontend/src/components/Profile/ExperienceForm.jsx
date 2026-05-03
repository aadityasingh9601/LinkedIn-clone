import { useForm } from "react-hook-form";
import useProfileStore from "../../stores/Profile";
import Button from "../shared-components/Buttons/Button";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import RHFInput from "../shared-components/Inputs/RHFInput";
import useUserStore from "../../stores/User";
import { ExperienceDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ExperienceForm({
  experience = {},
  updateVisState,
  onSubmitProp,
}) {
  const createProfile = useProfileStore((state) => state.createProfile);
  const currUserId = useUserStore((state) => state.currUserId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ExperienceDataSchema),
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
          errors={errors}
        />

        <RHFInput
          placeholder="Enter job title"
          name="jobTitle"
          register={register}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter start date (DD-MM-YYYY) "
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
          placeholder="Enter end date (DD-MM-YYYY)"
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
