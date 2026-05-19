import ExperienceForm from "./ExperienceForm";
import Pen from "../shared-components/Icons/Pen";
import styles from "./EducationCard.module.css";
import Trash from "../shared-components/Icons/Trash";
import useProfileStore from "../../stores/Profile";
import { useState } from "react";
import { formatDate } from "../../utils/helper";

export default function ExperienceCard({ experience, customStyles = {} }) {
  const [editExperience, setEditExperience] = useState(false);
  const deleteExperience = useProfileStore((state) => state.deleteExperience);
  return (
    <div className={`${styles.profileSectionCard}`}>
      {editExperience ? (
        <>
          <Trash onClick={() => deleteExperience(experience?._id)} />
          <ExperienceForm
            experience={experience}
            setShow={setEditExperience}
            mode="edit"
          />
        </>
      ) : (
        <>
          <div className={styles.img}>
            <img
              src="https://imgs.search.brave.com/uSrjHTiZQlCMFufzFNqTvVtqxxZ5e2WaN0ShQMixBoo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8xNTQ5OS8xNTQ5/OTQ0NS5wbmc_c2Vt/dD1haXNfaHlicmlk"
              alt=""
            />
          </div>
          <div>
            <p>
              <b>{experience?.companyName}</b>
            </p>
            <span>{experience?.jobTitle}</span>
            <br />
            <span className={styles.date}>
              {formatDate(experience?.started)} -{formatDate(experience?.ended)}
            </span>
            <br />
            <span>{experience?.description}</span>
          </div>
          <Pen onClick={() => setEditExperience(true)} styles={customStyles} />
        </>
      )}
    </div>
  );
}
