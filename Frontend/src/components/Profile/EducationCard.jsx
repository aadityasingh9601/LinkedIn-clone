import { useState } from "react";
import "./EducationCard.css";
import { formatDate } from "../../utils/helper";
import Pen from "../../icons/Pen";
import Trash from "../../icons/Trash";
import EducationForm from "./EducationForm";

export default function EducationCard({
  education,
  editProfile,
  deleteProfile,
}) {
  const [editEducation, setEditEducation] = useState(false);

  const updateEditEducation = (value) => {
    setEditEducation(value);
  };

  const startDate = formatDate(education.started);
  const endDate = formatDate(education.ended);

  const onSubmit = (data) => {
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
          <EducationForm
            education={education}
            onSubmitProp={onSubmit}
            updateVisState={updateEditEducation}
          />
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
