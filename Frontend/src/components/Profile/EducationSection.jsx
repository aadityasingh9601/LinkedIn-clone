import { useState } from "react";
import indexStyles from "./index.module.css";
import EducationForm from "./EducationForm";
import EducationCard from "./EducationCard";
import Plus from "../shared-components/Icons/Plus";

export default function EducationSection({ customStyles, profileEducation }) {
  const [addEducation, setAddEducation] = useState(false);
  return (
    <div className={indexStyles.profileSection}>
      <div className={indexStyles.head}>
        <div className={indexStyles.title}>Education</div>
        <div className={indexStyles.icons}>
          <Plus styles={customStyles} onClick={() => setAddEducation(true)} />
        </div>
      </div>
      <div>
        <div>
          {addEducation && <EducationForm setShow={setAddEducation} mode="add" />}
        </div>
        <div>
          {profileEducation?.map((e) => {
            return (
              <EducationCard
                key={e._id}
                education={e}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
