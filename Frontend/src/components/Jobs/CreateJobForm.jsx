import "./CreateJobForm.css";
import { useForm } from "react-hook-form";
import useJobStore from "../../stores/Job";
import { useEffect } from "react";
import Button from "../Button.";
import RHFtextarea from "../RHFtextarea";
import Xmark from "../../icons/Xmark";
import RHFInput from "../RHFInput";

export default function CreateJobForm({ job }) {
  const setpostJob = useJobStore((state) => state.setpostJob);
  const seteditJob = useJobStore((state) => state.seteditJob);
  const createJob = useJobStore((state) => state.createJob);
  const updateJob = useJobStore((state) => state.updateJob);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...job,
      skills: job?.skills.join(","),
      qualifications: job?.qualifications.join(","),
      //We're joining the array into a string because the backend sent an array , and if the user doesn't
      //updated skills or qualifications, they will stay an array, and they will cause problem at time of
      //submitting the form, as the skills & qualifications first gets converted to arrays for backend, because
      //backend needs them as arrays.
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    //We take input from the user as a single string and use split method to store each value in an array.

    const jobData = {
      ...data,

      skills: data.skills.split(","),
      qualifications: data.qualifications.split(","),
    };
    console.log(jobData);
    {
      job ? updateJob(jobData, job._id) : createJob(jobData);
    }
  };

  const jobType = watch("jobType");
  const mode = watch("mode");

  const handleChange = (event) => {
    setValue("jobType", event.target.value); // Update the value in React Hook Form
  };

  const handleChange2 = (event) => {
    setValue("mode", event.target.value); // Update the value in React Hook Form
  };
  return (
    <div className="createjobform">
      <Xmark
        onClick={() => {
          job ? seteditJob(false) : setpostJob(false);
        }}
      />

      <div className="h2">Create a job posting</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RHFInput
          placeholder="Write job title"
          register={register}
          name="title"
          rules={{
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Content should be at least 5 characters",
            },
          }}
          errors={errors}
        />

        <br />
        <RHFInput
          placeholder="Enter company name"
          name="company"
          register={register}
          rules={{
            required: "Company is required",
          }}
          errors={errors}
        />

        <br />
        <RHFInput
          placeholder="Enter company logo url"
          name="companyLogo"
          register={register}
        />

        <RHFtextarea
          register={register}
          errors={errors}
          name="companydescription"
          rules={{
            required: "Company description is required",
          }}
          placeholder="Enter company description"
        />
        <RHFInput
          placeholder="Company location"
          name="location"
          register={register}
          rules={{
            required: "Location is required",
          }}
          errors={errors}
        />
        <br />

        <label htmlFor="jobType">Job Type</label>
        <select
          id="jobType"
          value={jobType || ""}
          onChange={handleChange}
          {...register("jobType", {
            required: "JobType is required",
          })}
        >
          <option value="Full-time">Full-Time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>

        <br />

        <label htmlFor="mode">Mode</label>
        <select
          id="mode"
          value={mode || ""}
          onChange={handleChange2}
          {...register("mode", {
            required: "Job mode is required",
          })}
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
        </select>

        <br />
        <RHFInput
          placeholder="Enter salary"
          name="salary"
          register={register}
        />
        <br />

        <RHFtextarea
          register={register}
          errors={errors}
          name="qualifications"
          placeholder="Enter qualifications"
          rules={{
            required: "Qualifications are required",
          }}
        />

        <RHFInput
          placeholder="Enter skills required"
          name="skills"
          register={register}
          rules={{
            required: "Skills are required",
          }}
          errors={errors}
        />
        <br />

        <RHFtextarea
          register={register}
          errors={errors}
          name="jobdescription"
          placeholder="Enter job description"
          rules={{
            required: "Job description is required",
          }}
        />

        <br />

        <Button btnText="Submit" />
      </form>
    </div>
  );
}
