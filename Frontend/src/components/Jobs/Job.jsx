import "./Job.css";
import useUserStore from "../../stores/User";
import useJobStore from "../../stores/Job";
import { useState } from "react";
import Button from "../Button.";
import Ellipsis from "../../icons/Ellipsis";
import Xmark from "../../icons/Xmark";

export default function Job({ job }) {
  //console.log(job);
  const currUserId = useUserStore((state) => state.currUserId);
  const setcurrJobListingId = useJobStore((state) => state.setcurrJobListingId);
  const deleteJob = useJobStore((state) => state.deleteJob);
  const seteditJob = useJobStore((state) => state.seteditJob);
  const [jobOptions, setjobOptions] = useState(false);

  return (
    <div className="job" key={job._id}>
      {job.postedBy === currUserId && (
        <Ellipsis onClick={() => setjobOptions(true)} />
      )}

      {jobOptions && (
        <div className="options">
          <Xmark
            onClick={() => setjobOptions(false)}
            styles={{ position: "absolute", top: "0rem", right: "0rem" }}
          />

          <Button
            btnText="Edit"
            onClick={() => {
              setcurrJobListingId(job._id);
              seteditJob(true);
            }}
          />
          <Button btnText="Delete" onClick={() => deleteJob(job._id)} />
        </div>
      )}

      <div className="img">
        <img src={job?.companyLogo} />
      </div>
      <div className="details">
        <span
          className="title"
          onClick={() => {
            setcurrJobListingId(job._id);
          }}
        >
          {job?.title}
        </span>
        <br />
        <span style={{ fontSize: "0.85rem" }}>{job?.company}</span>
        <br />
        <span style={{ fontSize: "0.8rem" }}>{job?.location}</span>
      </div>
    </div>
  );
}
