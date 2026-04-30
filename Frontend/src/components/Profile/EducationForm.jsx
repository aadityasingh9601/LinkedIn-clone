import useProfileStore from "../../stores/Profile";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import RHFtextarea from "../RHFtextarea";
import RHFInput from "../RHFInput";
import useUserStore from "../../stores/User";
import { EducationDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EducationForm({
  education = {},
  updateVisState,
  onSubmitProp,
}) {
  const currUserId = useUserStore((state) => state.currUserId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EducationDataSchema),
    defaultValues: {
      ...education,
      started: education?.started?.split("T")[0],
      ended: education?.ended?.split("T")[0],
    },
  });
  // console.log(updateVisState);
  const createProfile = useProfileStore((state) => state.createProfile);

  const onSubmit = (education) => {
    console.log(education);
    createProfile({ education }, updateVisState);
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitProp || onSubmit)}>
        <RHFInput
          placeholder="Enter institution"
          register={register}
          name="institution"
          errors={errors}
        />

        <RHFInput
          name="degree"
          placeholder="Enter degree"
          register={register}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter start date (DD-MM-YYYY)"
          register={register}
          name="started"
          errors={errors}
        />

        <RHFInput
          placeholder="Enter end date (DD-MM-YYYY)"
          name="ended"
          register={register}
          errors={errors}
        />

        <RHFtextarea
          register={register}
          errors={errors}
          name="description"
          placeholder="Add some more details..."
        />

        <Button btnText="Cancel" onClick={() => updateVisState(false)} />
        <Button btnText="Save" />
      </form>
    </div>
  );
}
