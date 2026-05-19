import EducationForm from "./EducationForm";
import Pen from "../shared-components/Icons/Pen";
import styles from "./EducationCard.module.css";
import Trash from "../shared-components/Icons/Trash";
import useProfileStore from "../../stores/Profile";
import { useState } from "react";
import { formatDate } from "../../utils/helper";

export default function EducationCard({ education, customStyles = {} }) {
  console.log(education);
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
            <img
              src="https://imgs.search.brave.com/PtP9iSJxfTPjvd7bRThN2bLERZJsCUj7NoVbhdGbSlE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9zY2hvb2wt/aWNvbi1zdmctZG93/bmxvYWQtcG5nLTEw/ODc4ODk3LnBuZz9m/PXdlYnAmdz0xMjg"
              alt=""
            />
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
