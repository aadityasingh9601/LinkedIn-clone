import { useState } from "react";
import "./ExpCard.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";
import { formatDate } from "../../utils/helper";

export default function ExpCard({ experience, editProfile, deleteProfile }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...experience,
      started: experience.started.split("T")[0],
      ended: experience.ended.split("T")[0],
    },
  });

  const [editExperience, setEditExperience] = useState(false);
  const startDate = formatDate(experience.started);
  const endDate = formatDate(experience.ended);

  const onSubmit = (data) => {
    editProfile({
      section: "experience",
      sectionId: experience._id,
      newData: data,
    });
  };

  return (
    <div className="expCard">
      {editExperience ? (
        <>
          <Trash
            onClick={() =>
              deleteProfile({
                sectionId: experience._id,
                section: "experience",
              })
            }
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Enter your companyName"
              {...register("companyName", {
                required: "Company name is required",
                minLength: {
                  value: 5,
                  message: "Company name should be at least 5 characters",
                },
              })}
            />
            {errors.companyName && <p>{errors.companyName.message}</p>}

            <input
              placeholder="Enter your job title"
              {...register("jobTitle", {
                required: "Job Title is required",
                minLength: {
                  value: 2,
                  message: "Job Title should be at least 3 characters",
                },
              })}
            />

            <input
              placeholder="Start date"
              {...register("started", {
                required: "Start Date is required",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Date must be in yyyy-mm-dd format",
                },
              })}
            />

            {errors.started && <p>{errors.started.message}</p>}

            <input
              placeholder="End date"
              {...register("ended", {
                required: "End Date is required",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Date must be in yyyy-mm-dd format",
                },
              })}
            />

            {errors.ended && <p>{errors.ended.message}</p>}

            <textarea
              placeholder="Write your job description here..."
              {...register("description")}
            />

            <Button btnText="Cancel" onClick={() => setEditExperience(false)} />
            <Button btnText="Save changes" type="submit" />
          </form>
        </>
      ) : (
        <>
          <div className="img">
            <img
              src="https://tse1.mm.bing.net/th?id=OIP.8stsJDHh7WoOTlUsaX-ObwHaHa&pid=Api&P=0&h=180"
              alt=""
            />
          </div>
          <div>
            <p style={{ margin: "0", color: "black", fontSize: "1.05rem" }}>
              <b>{experience.companyName}</b>
            </p>
            <span>{experience.jobTitle}</span>
            <br />
            <span style={{ color: "rgba(0,0,0,0.65)" }}>
              {startDate} - {endDate}
            </span>{" "}
            <br />
            <span>{experience.description}</span>
          </div>
          <i
            class="fa-solid fa-pen"
            onClick={() => setEditExperience(true)}
          ></i>
        </>
      )}
    </div>
  );
}
