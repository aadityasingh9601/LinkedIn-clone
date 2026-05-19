import EducationForm from "./EducationForm";
import Pen from "../shared-components/Icons/Pen";
import styles from "./EducationCard.module.css";
import Trash from "../shared-components/Icons/Trash";
import "./EducationCard.module.css";
import useProfileStore from "../../stores/Profile";
import { useState } from "react";
import { formatDate } from "../../utils/helper";

export default function EducationCard({ education, customStyles = {} }) {
  const [editEducation, setEditEducation] = useState(false);
  const deleteEducation = useProfileStore((state) => state.deleteEducation);
  return (
    <div className={`${styles.profileSectionCard}`}>
      {editEducation ? (
        <>
          <Trash onClick={() => deleteEducation(education?._id)} />
          <EducationForm
            education={education}
            setShow={setEditEducation}
            mode="edit"
          />
        </>
      ) : (
        <>
          <div className={styles.img}>
            <img src={education.imageUrl} alt="" />
          </div>
          <div>
            <p>
              <b>{education?.institution}</b>
            </p>
            <span>{education.degree}</span>
            <br />
            <span className={styles.date}>
              {formatDate(education?.started)} -{formatDate(education?.ended)}
            </span>
            <br />
            <span>{education.description}</span>
          </div>
          <Pen onClick={() => setEditEducation(true)} styles={customStyles} />
        </>
      )}
    </div>
  );
}
