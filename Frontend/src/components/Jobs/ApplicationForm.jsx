import "./ApplicationForm.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";
import useJobStore from "../../stores/Job";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RHFInput from "../RHFInput";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  console.log(jobId);
  const applyToJob = useJobStore((state) => state.applyToJob);
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm();

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
        <textarea
          type="text"
          placeholder="Write your answer here..."
          {...register("answers.0", {
            required: "Answer is required",
            minLength: {
              value: 10,
              message: "Answer should be at least 10 characters",
            },
          })}
        />

        {errors.answers?.[0] && <p>{errors.answers[0].message}</p>}
        <br />

        <div>
          Which skill of yours do you believe will have the most impact in this
          role?
        </div>
        <textarea
          type="text"
          placeholder="Write your answer here..."
          {...register("answers.1", {
            required: "Answer is required",
            minLength: {
              value: 10,
              message: "Answer should be at least 10 characters",
            },
          })}
        />

        {errors.answers?.[1] && <p>{errors.answers[1].message}</p>}
        <br />

        <div>When would you be able to join if selected?</div>
        <textarea
          type="text"
          placeholder="Write your answer here..."
          {...register("answers.2", {
            required: "Answer is required",
            minLength: {
              value: 10,
              message: "Answer should be at least 10 characters",
            },
          })}
        />

        {errors.answers?.[2] && <p>{errors.answers[2].message}</p>}
        <br />

        <div>Upload your resume here</div>
        <RHFInput
          style={{ fontWeight: "500" }}
          type="file"
          name="resume"
          register={register}
          rules={{
            required: "Resume is required",
          }}
          errors={errors}
        />
        <br />
        <Button btnText="Submit" />
      </form>
    </div>
  );
}
