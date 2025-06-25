import "./jobDetail.css";
import useJobStore from "../../stores/Job";
import useUserStore from "../../stores/User";
import useProfileStore from "../../stores/Profile";

import Button from "../Button.";
import Dot from "../Dot";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Check from "../../icons/Check";
import TimePassed from "../TimePassed";
import JobFitStats from "./JobFitStats";

export default function JobDetail({ job }) {
  const navigate = useNavigate();
  const currUserId = useUserStore((state) => state.currUserId);
  //Getting the currUser's profile data from the local storage.
  const userProfile = JSON.parse(localStorage.getItem("currUserProfile"));

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveJob = useJobStore((state) => state.saveJob);

  const unapplyFromJob = useJobStore((state) => state.unapplyFromJob);

  const jobFitStats = useJobStore((state) => state.jobFitStats);

  const fetchJobFitStats = useJobStore((state) => state.fetchJobFitStats);

  const jobApplications = job?.applications;
  console.log(jobApplications);
  const existingApplication = jobApplications?.find(
    (a) => a?.applicant?.toString() === currUserId
  );

  useEffect(() => {
    if (existingApplication) {
      setApplied(true);
    }

    //Check if the userProfile equeals to the userProfile of the currUser only.
    if (userProfile?.myJobs?.saved.includes(job?._id)) {
      setSaved(true);
    }
  }, [job, userProfile, currUserId]);

  useEffect(() => {
    fetchJobFitStats(job?._id);
  }, [job]);

  return (
    <div className="jobDetail">
      <div className="aa">
        <img src={job?.companyLogo} />
        <span>{job?.company}</span>
      </div>
      <div className="bb">
        <div
          style={{
            fontWeight: "500",
            fontSize: "1.8rem",
            margin: "1rem 0 0.35rem 0",
          }}
        >
          {job?.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#444444",
            fontSize: "0.9rem",
            margin: "0 0 0.7rem 0",
          }}
        >
          {job?.location} <Dot />
          <TimePassed
            timePassed={job?.postedDate}
            styles={{ position: "relative", margin: "0 0.3rem 0 0" }}
          />{" "}
          ago
          <Dot />
          {job?.applications?.length} people clicked apply
        </div>
        <div style={{ display: "flex", margin: "0 0 0.85rem 0" }}>
          {/* <div>₹{job?.salary}/month</div> */}
          <div
            style={{
              backgroundColor: "rgb(232,232,232)",
              borderRadius: "0.3rem",
              fontSize: "0.9rem",
              padding: "0.25rem 0.4rem",
              margin: "0 0.3rem 0 0 ",
            }}
          >
            {job?.mode}
          </div>
          <div
            style={{
              backgroundColor: "rgb(218, 235, 209)",
              borderRadius: "0.3rem",
              padding: " 0.25rem 0.4rem",
              fontSize: "0.9rem",
            }}
          >
            <Check styles={{ marginRight: "0.3rem" }} />

            {job?.jobType}
          </div>
        </div>

        {currUserId !== job?.postedBy && (
          <JobFitStats jobFitStats={jobFitStats} jobSkills={job?.skills} />
        )}

        <div className="job_btns">
          {currUserId !== job?.postedBy &&
            (applied ? (
              <Button
                btnText={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>
                        Applied
                        <Check />
                      </span>
                    </div>
                  </>
                }
                onClick={() => {
                  unapplyFromJob(job._id);
                  setApplied(false);
                }}
              />
            ) : (
              <Button
                btnText="Apply"
                onClick={() => {
                  setApplied(true);
                  navigate(`/jobs/${job._id}/apply`);
                }}
              />
            ))}

          {saved ? (
            <Button
              btnText="Saved"
              onClick={() => {
                saveJob(job._id), setSaved(false);
              }}
            />
          ) : (
            <Button
              btnText="Save"
              onClick={() => {
                saveJob(job._id), setSaved(true);
              }}
            />
          )}
        </div>
      </div>

      <div className="c">
        <div
          style={{
            fontWeight: "500",
            fontSize: "1.3rem",
            margin: "0 0 0.7rem 0",
          }}
        >
          About the job
        </div>
        <div className="subsection">
          <span className="subtitle">Skills required</span>

          <div>
            {" "}
            {job?.skills?.map((q) => {
              return <li>{q}</li>;
            })}
          </div>
        </div>

        <div className="subsection">
          <span className="subtitle">Company overview</span>
          <div> {job?.companydescription}</div>
        </div>

        <div className="subsection">
          <span className="subtitle">Required qualifications</span>
          <div>
            {job?.qualifications?.map((q) => {
              return <li>{q}</li>;
            })}
          </div>
        </div>

        <div className="subsection">
          <span className="subtitle">Job overview</span>
          <div> {job?.jobdescription}</div>
        </div>

        {currUserId === job?.postedBy && (
          <div
            style={{
              backgroundColor: "green",
              padding: "1rem",
              maxHeight: "20rem",
              maxWidth: "95%",
            }}
          >
            <Button
              btnText="View Applicants"
              onClick={() => navigate(`/jobs/${job._id}/applications`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
