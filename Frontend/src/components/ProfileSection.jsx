import "./ProfileSection.css";
import { useState, useEffect } from "react";
import EducationCard from "./Profile/EducationCard";
import ExpCard from "./Profile/ExpCard";
import EducationForm from "./Profile/EducationForm";
import ExperienceForm from "./Profile/ExperienceForm";
import Plus from "../icons/Plus";
import Pen from "../icons/Pen";
import Trash from "../icons/Trash";
import ControlledTextarea from "./ControlledTextarea";
import ControlledInput from "./ControlledInput";
import Button from "./Button.";

export default function ProfileSection({
  title,
  profile,
  styles,
  editProfile,
  deleteProfile,
}) {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [newAbout, setnewAbout] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const updateVisState = (value) => {
    setAddSection(value);
  };

  useEffect(() => {
    if (profile.about) {
      setnewAbout(profile.about);
    }
  }, [profile.about]);
  return (
    <div className="profileSection">
      <div className="head">
        <span>{title}</span>
        <div className="icons">
          {title.toLowerCase() == "about" ? (
            <Pen styles={styles} onClick={() => setEditSection(true)} />
          ) : (
            <Plus styles={styles} onClick={() => setAddSection(true)} />
          )}
        </div>
      </div>
      <div>
        {addSection &&
          (title.toLowerCase() == "education" ? (
            <EducationForm updateVisState={updateVisState} />
          ) : title.toLowerCase() == "experience" ? (
            <ExperienceForm updateVisState={updateVisState} />
          ) : title.toLowerCase() == "skills" ? (
            <>
              <ControlledInput
                value={newSkill}
                placeholder="Skill"
                onChange={(e) => {
                  setNewSkill(e.target.value);
                }}
              />
              <Button btnText="Cancel" onClick={() => setAddSection(false)} />
              <Button
                btnText="Add"
                onClick={() => {
                  setNewSkill("");
                  editProfile({ skill: newSkill });
                }}
              />
            </>
          ) : null)}
        {editSection && (
          <>
            <ControlledTextarea
              name="about"
              value={newAbout}
              onChange={(e) => setnewAbout(e.target.value)}
            />

            <Button btnText="Cancel" onClick={() => setEditSection(false)} />
            <Button
              btnText="Save Changes"
              onClick={() => {
                editProfile({ section: "about", newData: newAbout });
              }}
            />
          </>
        )}
        <div>
          {title.toLowerCase() == "education"
            ? profile.education?.map((education) => {
                return (
                  <EducationCard
                    key={education._id}
                    education={education}
                    editProfile={editProfile}
                    deleteProfile={deleteProfile}
                  />
                );
              })
            : title.toLowerCase() == "experience"
            ? profile.experience?.map((experience) => {
                return (
                  <ExpCard
                    key={experience._id}
                    experience={experience}
                    editProfile={editProfile}
                    deleteProfile={deleteProfile}
                  />
                );
              })
            : title.toLowerCase() == "skills"
            ? profile.skills?.map((skill, index) => (
                <div key={index} className="skill">
                  <div>{skill}</div>
                  <div className="icon">
                    <Trash
                      styles={styles}
                      onClick={() => deleteProfile({ skill: skill })}
                    />
                  </div>
                </div>
              ))
            : !editSection && <span>{profile.about}</span>}
        </div>
      </div>
    </div>
  );
}
