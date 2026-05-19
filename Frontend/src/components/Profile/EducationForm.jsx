import useProfileStore from "../../stores/Profile";
import Button from "../shared-components/Buttons/Button";
import indexStyles from "./index.module.css";
import { useForm } from "react-hook-form";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import RHFInput from "../shared-components/Inputs/RHFInput";
import useUserStore from "../../stores/User";
import { EducationDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import { useState } from "react";
import Spinner from "../shared-components/Loaders/Spinner";

export default function EducationForm({ education = {}, setShow, mode }) {
  const [isLoading, setIsLoading] = useState(false);
  const addEducation = useProfileStore((s) => s.addEducation);
  const updateEducation = useProfileStore((s) => s.updateEducation);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EducationDataSchema),
    defaultValues: {
      ...education,
      started: education?.started?.split("T")[0].split("-").reverse().join("-"),
      ended: education?.ended?.split("T")[0].split("-").reverse().join("-"),
    },
  });

  const onSubmit = (educationData) => {
    console.log(educationData);
    mode === "add"
      ? addEducation(educationData, setIsLoading)
      : updateEducation(education?._id, educationData, setIsLoading, setShow);
    reset();
  };
  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
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
