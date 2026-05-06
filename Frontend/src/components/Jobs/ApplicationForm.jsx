import "./ApplicationForm.css";
import { useForm } from "react-hook-form";
import Button from "../shared-components/Buttons/Button";
import useJobStore from "../../stores/Job";
import { useParams, useNavigate } from "react-router-dom";
import RHFInput from "../shared-components/Inputs/RHFInput";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import { JobApplicationDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  console.log(jobId);
  const applyToJob = useJobStore((state) => state.applyToJob);
  const {
    register,
    handleSubmit,
    reset,
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
    applyToJob(jobId, applicationData, navigate);
  };

  return (
    <div className="applicationForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ fontWeight: "500", fontSize: "1.8rem" }}>
          This is our application form.
        </div>

        <div>Why are you interested in this role?</div>
        <RHFtextarea
          name="answers.0"
          placeholder="Write your answer here..."
          register={register}
          errors={errors}
        />

        <div>
          Which skill of yours do you believe will have the most impact in this
          role?
        </div>
        <RHFtextarea
          name="answers.1"
          placeholder="Write your answer here..."
          register={register}
          errors={errors}
        />

        <div>When would you be able to join if selected?</div>
        <RHFtextarea
          name="answers.2"
          placeholder="Write your answer here..."
          register={register}
          errors={errors}
        />

        <div>Upload your resume here</div>
        <RHFInput
          style={{ fontWeight: "500" }}
          type="file"
          name="resume"
          register={register}
          errors={errors}
        />
        <Button btnText="Submit" />
      </form>
    </div>
  );
}
