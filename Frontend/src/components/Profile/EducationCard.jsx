import { useState } from "react";
import "./EducationCard.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";

export default function EducationCard({
  education,
  editProfile,
  deleteProfile,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: education });

  const [editEducation, setEditEducation] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const startDate = formatDate(education.started);
  const endDate = formatDate(education.ended);

  const onSubmit = (data) => {
    console.log(data);
    editProfile({
      section: "education",
      sectionId: education._id,
      newData: data,
    });
  };

  return (
    <div className="educationCard">
      {editEducation ? (
        <>
          <i
            class="fa-solid fa-trash"
            onClick={() =>
              deleteProfile({ sectionId: education._id, section: "education" })
            }
          ></i>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Enter your institution"
              {...register("institution", {
                required: "Institution is required",
                minLength: {
                  value: 5,
                  message: "Institution should be at least 5 characters",
                },
              })}
            />
            {errors.institution && <p>{errors.institution.message}</p>}

            <input
              placeholder="Enter your degree"
              {...register("degree", {
                required: "Degree is required",
                minLength: {
                  value: 2,
                  message: "Degree should be at least 2 characters",
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

            <Button btnText="Cancel" onClick={() => setEditEducation(false)} />
            <Button btnText="Save changes" type="submit" />
          </form>
        </>
      ) : (
        <>
          <div className="img">
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.YzgkSxKcApsL8s0r-6cnkwHaHa&pid=Api&P=0&h=180"
              alt=""
            />
          </div>
          <div>
            <p style={{ margin: "0", color: "black", fontSize: "1.05rem" }}>
              <b>{education.institution}</b>
            </p>
            <span>{education.degree}</span>
            <br />
            <span style={{ color: "rgba(0,0,0,0.65)" }}>
              {startDate} - {endDate}
            </span>
          </div>
          <i class="fa-solid fa-pen" onClick={() => setEditEducation(true)}></i>
        </>
      )}
    </div>
  );
}
