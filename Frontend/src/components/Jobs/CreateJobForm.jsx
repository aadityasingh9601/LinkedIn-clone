import "./CreateJobForm.css";
import { useForm } from "react-hook-form";
import useJobStore from "../../stores/Job";
import { useEffect } from "react";
import Button from "../Button.";
import RHFtextarea from "../RHFtextarea";

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
      <i
        className="fa-solid fa-xmark"
        onClick={() => {
          job ? seteditJob(false) : setpostJob(false);
        }}
      ></i>

      <h3>This is our post a job form.</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Write job title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Content should be at least 5 characters",
            },
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}
        <br />

        <input
          type="text"
          placeholder="Enter company name"
          {...register("company", {
            required: "Company is required",
          })}
        />
        {errors.company && <p>{errors.company.message}</p>}
        <br />

        <input
          type="text"
          placeholder="Enter company logo url"
          {...register("companyLogo")}
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

        <input
          type="text"
          placeholder="Company location"
          {...register("location", {
            required: "Location is required",
          })}
        />
        {errors.location && <p>{errors.location.message}</p>}
        <br />

        <label htmlFor="jobType" className="block font-medium mb-1">
          Job Type
        </label>
        <select
          id="jobType"
          value={jobType || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
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

        <label htmlFor="mode" className="block font-medium mb-1">
          Mode
        </label>
        <select
          id="mode"
          value={mode || ""}
          onChange={handleChange2}
          className="border p-2 rounded w-full"
          {...register("mode", {
            required: "Job mode is required",
          })}
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
        </select>

        <br />

        <input type="text" placeholder="Enter salary" {...register("salary")} />

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

        <input
          type="text"
          placeholder="Enter skills required"
          {...register("skills", {
            required: "Skills are required",
          })}
        />
        {errors.skills && <p>{errors.skills.message}</p>}
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
