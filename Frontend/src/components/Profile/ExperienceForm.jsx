import useProfileStore from "../../stores/Profile";
import Button from "../shared-components/Buttons/Button";
import indexStyles from "./index.module.css";
import { useForm } from "react-hook-form";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import RHFInput from "../shared-components/Inputs/RHFInput";
import useUserStore from "../../stores/User";
import { ExperienceDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import { useState } from "react";
import Spinner from "../shared-components/Loaders/Spinner";

export default function ExperienceForm({ experience = {}, setShow, mode }) {
  const [isLoading, setIsLoading] = useState(false);
  const addExperience = useProfileStore((s) => s.addExperience);
  const updateExperience = useProfileStore((s) => s.updateExperience);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ExperienceDataSchema),
    defaultValues: {
      ...experience,
      started: experience?.started?.split("T")[0].split("-").reverse().join("-"),
      ended: experience?.ended?.split("T")[0].split("-").reverse().join("-"),
    },
  });

  const onSubmit = (experienceData) => {
    console.log(experienceData);
    mode === "add"
      ? addExperience(experienceData, setIsLoading)
      : updateExperience(experience?._id, experienceData, setIsLoading, setShow);
    reset();
  };
  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <RHFInput
        placeholder="Enter company"
        register={register}
        name="companyName"
        errors={errors}
      />

      <RHFInput
        name="jobTitle"
        placeholder="Enter job title"
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

      <div className={indexStyles.buttonWrapper}>
        <Button
          variant="sm"
          btnText="Cancel"
          onClick={() => {
            setShow(false);
          }}
        />
        <Button
          variant="sm"
          type="submit"
          btnText={isLoading ? <Spinner height={17} width={17} /> : "Save"}
        />
      </div>
    </FormWrapper>
  );
}
