import "./jobDetail.css";
import useJobStore from "../../stores/Job";
import useUserStore from "../../stores/User";
import { useEffect, useState } from "react";
import Button from "../Button.";

export default function JobDetail({ job }) {
  const jobData = job[0];
  const currUserId = useUserStore((state) => state.currUserId);
  const currJobListingId = useJobStore((state) => state.currJobListingId);
  const applyToJob = useJobStore((state) => state.applyToJob);
  const unapplyFromJob = useJobStore((state) => state.unapplyFromJob);
  const applied = useJobStore((state) => state.applied);
  const setApplied = useJobStore((state) => state.setApplied);
  const appliedStatus = useJobStore((state) => state.appliedStatus);
  console.log(jobData?.postedBy);
  console.log(currUserId);
  useEffect(() => {
    appliedStatus(currJobListingId);
  }, [currJobListingId]);

  return (
    <div className="jobDetail">
      <div className="a">
        <div>
          <img src={jobData?.companyLogo} />
          <span>{jobData?.company}</span>
        </div>
      </div>
      <div className="b">
        <h3>{jobData?.title}</h3>
        <span>
          {jobData?.location} {jobData?.postedDate}{" "}
          {jobData?.applicants?.length} people clicked apply
        </span>
        <div>
          <div>₹{jobData?.salary}/month</div>
          <div> On-site</div>
          <div>{jobData?.jobType}</div>
        </div>
        <div>
          {currUserId !== jobData?.postedBy &&
            (applied ? (
              <Button
                btnText={
                  <>
                    <span>Applied</span> <i class="fa-solid fa-check"></i>
                  </>
                }
                onClick={() => {
                  unapplyFromJob(jobData._id);
                  setApplied(false);
                }}
              />
            ) : (
              <Button
                btnText="Apply"
                onClick={() => {
                  applyToJob(jobData._id);
                  setApplied(true);
                }}
              />
            ))}
        </div>
      </div>
      <div className="c">
        <h4>About the job</h4>
        <div>
          <span>
            <b>Skills:</b>
          </span>
          <br />
          <span>{jobData?.skills}</span>
        </div>

        <div>
          <span>
            <b>Company overview</b>
          </span>
          <span> {jobData?.companydescription}</span>
        </div>

        <div>
          <span>
            <b>Required qualifications</b>
          </span>
          {jobData?.qualifications?.map((q) => {
            return <li>{q}</li>;
          })}
        </div>

        <div>
          <span>
            <b>Job overview</b>
          </span>
          <span> {jobData?.jobdescription}</span>
        </div>

        {currUserId === jobData?.postedBy && (
          <div
            style={{
              backgroundColor: "green",
              padding: "1rem",
              maxHeight: "20rem",
              maxWidth: "95%",
            }}
          >
            <h4>Applicants</h4>
            {jobData?.applicants.map((applicant) => {
              return (
                <div
                  key={applicant._id}
                  style={{
                    display: "flex",
                    backgroundColor: "yellow",
                    padding: "0.3rem 0.4rem 0 0.4rem",
                    marginBottom: "1rem",
                    border: "1px solid gray",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div>
                    <img
                      src={applicant.profile.profileImage.url}
                      style={{
                        height: "3rem",
                        width: "3rem",
                        borderRadius: "50%",
                        marginRight: "1rem",
                      }}
                    />
                  </div>
                  <div>
                    <div>
                      <b>{applicant.profile.name}</b>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "grey" }}>
                      {applicant.profile.headline}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
