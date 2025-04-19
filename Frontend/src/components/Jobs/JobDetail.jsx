import "./jobDetail.css";
import useJobStore from "../../stores/Job";
import useUserStore from "../../stores/User";

import Button from "../Button.";
import { timeRep } from "../../utils/helper";
import Dot from "../Dot";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JobDetail({ job }) {
  const navigate = useNavigate();
  const jobData = job[0];
  //console.log(jobData);
  const currUserId = useUserStore((state) => state.currUserId);
  const [applied, setApplied] = useState(false);

  const unapplyFromJob = useJobStore((state) => state.unapplyFromJob);

  const jobFitStats = useJobStore((state) => state.jobFitStats);

  const matchedScore = jobFitStats?.matchedScore;

  console.log(matchedScore);

  const fetchJobFitStats = useJobStore((state) => state.fetchJobFitStats);

  const jobApplications = jobData?.applications;
  //console.log(jobApplications);
  // const existingApplication = jobApplications?.find(
  //   (a) => a.applicant.toString() === currUserId
  // );

  useEffect(() => {
    fetchJobFitStats(jobData._id);
  }, [jobData._id]);

  // useEffect(() => {
  //   if (existingApplication) {
  //     setApplied(true);
  //   }
  // }, []);

  const { days, hours, minutes, seconds } = timeRep(
    new Date() - new Date(jobData?.postedDate)
  );

  return (
    <div className="jobDetail">
      <div className="aa">
        <img src={jobData?.companyLogo} />
        <span>{jobData?.company}</span>
      </div>
      <div className="bb">
        <div
          style={{
            fontWeight: "500",
            fontSize: "1.8rem",
            margin: "1rem 0 0.35rem 0",
          }}
        >
          {jobData?.title}
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
          {jobData?.location} <Dot />
          {days > 0
            ? `${days} days `
            : hours > 0
            ? `${hours} hrs `
            : minutes > 0
            ? `${minutes} min`
            : `${seconds} s`}
          ago
          <Dot />
          {jobData?.applicants?.length} people clicked apply
        </div>
        <div style={{ display: "flex", margin: "0 0 0.85rem 0" }}>
          {/* <div>₹{jobData?.salary}/month</div> */}
          <div
            style={{
              backgroundColor: "rgb(232,232,232)",
              borderRadius: "0.3rem",
              fontSize: "0.9rem",
              padding: "0.25rem 0.4rem",
              margin: "0 0.3rem 0 0 ",
            }}
          >
            {jobData?.mode}
          </div>
          <div
            style={{
              backgroundColor: "rgb(218, 235, 209)",
              borderRadius: "0.3rem",
              padding: " 0.25rem 0.4rem",
              fontSize: "0.9rem",
            }}
          >
            <i class="fa-solid fa-check" style={{ marginRight: "0.3rem" }}></i>
            {jobData?.jobType}
          </div>
        </div>

        {currUserId !== jobData?.postedBy && (
          <div className="jobfitstats">
            <div
              style={{
                backgroundColor: "rgb(218, 235, 209)",
              }}
            >
              📊Match score: {matchedScore}%
            </div>

            <div
              style={{
                backgroundColor: "rgb(232,232,232)",
              }}
            >
              {jobFitStats?.matchedSkills?.length} out of{" "}
              {jobData?.skills.length} skills matched:
              {jobFitStats?.matchedSkills?.map((s) => {
                return "✅" + s + " ";
              })}
            </div>

            <div
              style={{
                backgroundColor: "#fddcdc",
              }}
            >
              You're missing:
              {jobFitStats?.missingSkills?.map((s) => {
                return "❌" + s + " ";
              })}
            </div>

            <div
              style={{
                backgroundColor: "#fef9c3",
              }}
            >
              💡Suggested actions:
              {jobFitStats?.missingSkills?.map((s) => {
                return "[ Learn " + s + " ]";
              })}
              [ Apply anyway ].
            </div>

            <div
              style={{
                backgroundColor: " #e0f2fe",
              }}
            >
              📌Recommended resources to learn{" "}
            </div>

            <div>
              {matchedScore >= 80
                ? "🎯 You’re highly likely to be a great fit for this job!"
                : matchedScore >= 60 && matchedScore < 80
                ? "💪 You meet most requirements – consider applying!"
                : matchedScore >= 40 && matchedScore < 60
                ? "⚠️ You match some skills - try upskilling or apply with a strong case."
                : "🌱 You currently lack many of the required skills - learning them can help a lot!"}
            </div>

            <div className="note">
              <span style={{ fontWeight: "bold" }}>ℹ️ Note:</span> This is just
              an automated estimate. Actual job success depends on various
              factors like experience, portfolio, and communication skills too.
            </div>
          </div>
        )}

        <div className="job_btns">
          {currUserId !== jobData?.postedBy &&
            (applied ? (
              <Button
                btnText={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>Applied</span> <i class="fa-solid fa-check"></i>
                    </div>
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
                  setApplied(true);
                  navigate(`/jobs/${jobData._id}/apply`);
                }}
              />
            ))}

          <Button btnText="Save" />
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
            {jobData?.skills?.map((q) => {
              return <li>{q}</li>;
            })}
          </div>
        </div>

        <div className="subsection">
          <span className="subtitle">Company overview</span>
          <div> {jobData?.companydescription}</div>
        </div>

        <div className="subsection">
          <span className="subtitle">Required qualifications</span>
          <div>
            {jobData?.qualifications?.map((q) => {
              return <li>{q}</li>;
            })}
          </div>
        </div>

        <div className="subsection">
          <span className="subtitle">Job overview</span>
          <div> {jobData?.jobdescription}</div>
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
            <Button
              btnText="View Applicants"
              onClick={() => navigate(`/jobs/${jobData._id}/applications`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
