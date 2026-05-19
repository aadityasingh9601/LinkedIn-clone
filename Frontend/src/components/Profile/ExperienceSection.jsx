import { useState } from "react";
import indexStyles from "./index.module.css";
import ExperienceForm from "./ExperienceForm";
import ExperienceCard from "./ExperienceCard";
import Plus from "../shared-components/Icons/Plus";

export default function ExperienceSection({ customStyles, profileExperience }) {
  const [addExperience, setAddExperience] = useState(false);
  return (
    <div className={indexStyles.profileSection}>
      <div className={indexStyles.head}>
        <div className={indexStyles.title}>Experience</div>
        <div className={indexStyles.icons}>
          <Plus styles={customStyles} onClick={() => setAddExperience(true)} />
        </div>
      </div>
      <div>
        <div>
          {addExperience && (
            <ExperienceForm setShow={setAddExperience} mode="add" />
          )}
        </div>
        <div>
          {profileExperience?.map((e) => {
            return <ExperienceCard key={e._id} experience={e} />;
          })}
        </div>
      </div>
    </div>
  );
}
