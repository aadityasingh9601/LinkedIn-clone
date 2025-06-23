import "./ProfileSectionCard.css";
import { useState } from "react";
import { formatDate } from "../utils/helper";
import Pen from "../icons/Pen";
import Trash from "../icons/Trash";

export default function ProfileSectionCard({
  data,
  section,
  FormComponent,
  editProfile,
  deleteProfile,
  imageUrl,
  fields = {
    titleKey: "title",
    subtitleKey: "subtitle",
    startKey: "started",
    endKey: "ended",
    descriptionKey: "description",
  },
}) {
  const [editing, setEditing] = useState(false);

  const updateEditing = (value) => {
    console.log("triggered");
    setEditing(value);
  };

  const startDate = formatDate(data[fields.startKey]);
  const endDate = formatDate(data[fields.endKey]);

  const onSubmit = (newData) => {
    editProfile(
      {
        section,
        sectionId: data._id,
        newData: newData,
      },
      updateEditing
    );
  };

  return (
    <div className="profileSectionCard">
      {editing ? (
        <>
          <Trash
            onClick={() => deleteProfile({ sectionId: data._id, section })}
          />
          <FormComponent
            {...{ [section]: data }}
            onSubmitProp={onSubmit}
            updateVisState={updateEditing}
          />
        </>
      ) : (
        <>
          <div className="img">
            <img src={imageUrl} alt="" />
          </div>
          <div>
            <p>
              <b>{data[fields.titleKey]}</b>
            </p>
            <span>{data[fields.subtitleKey]}</span>
            <br />
            <span className="date">
              {startDate} - {endDate}
            </span>
            <br />
            <span>{data[fields.descriptionKey]}</span>
          </div>
          <Pen onClick={() => updateEditing(true)} />
        </>
      )}
    </div>
  );
}
