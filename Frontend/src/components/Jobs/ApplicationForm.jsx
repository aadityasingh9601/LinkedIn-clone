import styles from "./ApplicationForm.module.css";
import { useForm } from "react-hook-form";
import Button from "../shared-components/Buttons/Button";
import useJobStore from "../../stores/Job";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import RHFInput from "../shared-components/Inputs/RHFInput";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import { JobApplicationDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import Spinner from "../shared-components/Loaders/Spinner";
import { useState } from "react";

export default function ApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const applyToJob = useJobStore((state) => state.applyToJob);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(JobApplicationDataSchema),
  });

  const onSubmit = (data) => {
    let applicationData = {
      ...data,
      resume: data.resume[0],
    };
    console.log(applicationData);
    setIsLoading(true);
    applyToJob(jobId, applicationData, navigate, setIsLoading);
  };

  console.log(errors);

  return (
    <div className={styles.applicationForm}>
      <div className={styles.header}>Job Application Form</div>
      <FormWrapper id="applicationForm" onSubmit={handleSubmit(onSubmit)}>
        <div>Why are you interested in this role?</div>
        <RHFtextarea
          name="answers.0"
          placeholder="Write your answer here..."
          register={register}
          errors={{
            "answers.0": errors.answers?.[0],
          }}
        />

        <div>
          Which skill of yours do you believe will have the most impact in this
          role?
        </div>
        <RHFtextarea
          name="answers.1"
          placeholder="Write your answer here..."
          register={register}
          errors={{
            "answers.1": errors.answers?.[1],
          }}
        />

        <div>When would you be able to join if selected?</div>
        <RHFtextarea
          name="answers.2"
          placeholder="Write your answer here..."
          register={register}
          errors={{
            "answers.2": errors.answers?.[2],
          }}
        />
      </FormWrapper>
      <div className={styles.footer}>
        <div>Resume</div>
        <RHFInput
          type="file"
          name="resume"
          register={register}
          errors={errors}
        />
        <div>
          <Button
            variant="sm"
            btnText={isLoading ? <Spinner /> : "Submit"}
            form="applicationForm"
          />
        </div>
      </div>
    </div>
  );
}
