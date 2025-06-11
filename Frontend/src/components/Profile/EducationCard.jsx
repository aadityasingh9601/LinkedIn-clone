import { useState } from "react";
import "./EducationCard.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";
import { formatDate } from "../../utils/helper";
import Pen from "../../icons/Pen";
import RHFInput from "../RHFinput";
import Trash from "../../icons/Trash";

export default function EducationCard({
  education,
  editProfile,
  deleteProfile,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...education,
      started: education.started.split("T")[0],
      ended: education.ended.split("T")[0],
    },
  });

  const [editEducation, setEditEducation] = useState(false);

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
          <Trash
            onClick={() =>
              deleteProfile({ sectionId: education._id, section: "education" })
            }
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <RHFInput
              type="text"
              name="institution"
              placeholder="Enter your institution"
              register={register}
              rules={{
                required: "Institution is required",
                minLength: {
                  value: 5,
                  message: "Institution should be at least 5 characters",
                },
              }}
              errors={errors}
            />
            <RHFInput
              placeholder="Enter your degree"
              name="degree"
              register={register}
              rules={{
                required: "Degree is required",
                minLength: {
                  value: 2,
                  message: "Degree should be at least 2 characters",
                },
              }}
              errors={errors}
            />

            <RHFInput
              placeholder="Start date"
              name="started"
              register={register}
              rules={{
                required: "Start Date is required",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Date must be in yyyy-mm-dd format",
                },
              }}
              errors={errors}
            />
            <RHFInput
              placeholder="End date"
              name="ended"
              register={register}
              rules={{
                required: "End Date is required",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Date must be in yyyy-mm-dd format",
                },
              }}
              errors={errors}
            />

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
          <Pen onClick={() => setEditEducation(true)} />
        </>
      )}
    </div>
  );
}
