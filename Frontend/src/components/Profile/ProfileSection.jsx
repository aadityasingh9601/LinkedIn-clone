import "./ProfileSection.css";
import { useState, useEffect, lazy, Suspense } from "react";
import EducationCard from "./EducationCard";
import ExpCard from "./ExpCard";
import Plus from "../../icons/Plus";
import Pen from "../../icons/Pen";
import Trash from "../../icons/Trash";
import ControlledTextarea from "../ControlledTextarea";
import ControlledInput from "../ControlledInput";
import Button from "../Button.";
import useUserStore from "../../stores/User";

const EducationForm = lazy(() => import("./EducationForm"));
const ExperienceForm = lazy(() => import("./ExperienceForm"));

export default function ProfileSection({
  title,
  profile,
  styles,
  editProfile,
  deleteProfile,
}) {
  const currUserId = useUserStore((state) => state.currUserId);
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [newAbout, setnewAbout] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const updateVisState = (value) => {
    setAddSection(value);
  };

  const updateEditSection = (value) => {
    setEditSection(value);
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
            <Suspense fallback={<div>Loading...</div>}>
              <EducationForm updateVisState={updateVisState} />
            </Suspense>
          ) : title.toLowerCase() == "experience" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <ExperienceForm updateVisState={updateVisState} />
            </Suspense>
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
                editProfile(
                  { section: "about", newData: newAbout },
                  updateEditSection
                );
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
                    styles={styles}
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
                    styles={styles}
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
