import { useState } from "react";
import "./ExpCard.css";
import { formatDate } from "../../utils/helper";
import Pen from "../../icons/Pen";
import Trash from "../../icons/Trash";
import ExperienceForm from "./ExperienceForm";

export default function ExpCard({ experience, editProfile, deleteProfile }) {
  const [editExperience, setEditExperience] = useState(false);
  const startDate = formatDate(experience.started);
  const endDate = formatDate(experience.ended);
  const updateEditExperience = (value) => {
    setEditExperience(value);
  };

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

          <ExperienceForm
            experience={experience}
            updateVisState={updateEditExperience}
            onSubmitProp={onSubmit}
          />
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
          <Pen onClick={() => updateEditExperience(true)} />
        </>
      )}
    </div>
  );
}
