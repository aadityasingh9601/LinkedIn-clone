import "./Job.css";
import useUserStore from "../../stores/User";
import useJobStore from "../../stores/Job";
import { useState } from "react";
import Button from "../Button.";

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
        <i onClick={() => setjobOptions(true)} class="fa-solid fa-ellipsis"></i>
      )}

      {jobOptions && (
        <div className="options">
          <i
            class="fa-solid fa-xmark"
            onClick={() => setjobOptions(false)}
            style={{ position: "absolute", top: "0rem", right: "0rem" }}
          ></i>
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
