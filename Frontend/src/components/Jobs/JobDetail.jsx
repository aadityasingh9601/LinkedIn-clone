import styles from "./JobDetail.module.css";
import useJobStore from "../../stores/Job";
import useUserStore from "../../stores/User";
import UserAvatar from "../shared-components/User/UserAvatar";
import Button from "../shared-components/Buttons/Button";
import Dot from "../shared-components/Dot/Dot";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Check from "../shared-components/Icons/Check";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import JobFitStats from "../Jobs/JobFitStats";

export default function JobDetail({ job }) {
  console.log(job);
  const navigate = useNavigate();
  const currUserId = useUserStore((s) => s.currUserId);
  const userProfile = useUserStore((s) => s.currUserProfile);

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveJob = useJobStore((s) => s.saveJob);
  const unapplyFromJob = useJobStore((s) => s.unapplyFromJob);
  const jobFitStats = useJobStore((s) => s.jobFitStats);
  const getJobFitStats = useJobStore((s) => s.getJobFitStats);

  const jobApplications = job?.applications;
  //console.log(jobApplications);
  const existingApplication = jobApplications?.find(
    (a) => a?.applicant?.toString() === currUserId,
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
    getJobFitStats(job?._id);
  }, [job]);

  return (
    <div className={styles.jobDetail}>
      <div className={styles.companyInfo}>
        <UserAvatar
          customStyles={{ borderRadius: 0, border: "1px solid black" }}
          url={job?.companyLogo}
        />
        <div>{job?.company}</div>
      </div>

      <div className={styles.jobInfo}>
        <div className={styles.jobTitle}>{job?.title}</div>
        <div className={styles.jobLocation}>
          {job?.location} <Dot />
          <TimePassed
            timePassed={job?.postedDate}
            styles={{ position: "relative", margin: "0 0.3rem 0 0" }}
          />{" "}
          ago
          <Dot />
          {job?.applications?.length} people clicked apply
        </div>
        <div className={styles.jobTypeAndMode}>
          <div className={styles.jobTypeTag}>{job?.jobType} </div>
          <div className={styles.jobModeTag}>{job?.jobMode}</div>
        </div>
      </div>

      <div className={styles.applicantTab}>
        <div>
          {currUserId !== job?.postedBy && (
            <JobFitStats jobFitStats={jobFitStats} jobSkills={job?.skills} />
          )}
        </div>

        <div className={styles.applicantTabButtons}>
          {currUserId !== job?.postedBy &&
            (applied ? (
              <Button
                variant="sm"
                btnText={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Applied
                      <Check />
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
                variant="sm"
                btnText="Apply"
                onClick={() => {
                  setApplied(true);
                  navigate(`/jobs/${job._id}/apply`);
                }}
              />
            ))}

          {saved ? (
            <Button
              variant="sm"
              btnText="Saved"
              onClick={() => {
                (saveJob(job._id), setSaved(false));
              }}
            />
          ) : (
            <Button
              variant="sm"
              btnText="Save"
              onClick={() => {
                (saveJob(job._id), setSaved(true));
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.aboutTheJob}>
        <div className={styles.header}>About the job</div>

        <div>
          <div className={styles.subtitle}>Skills required</div>
          <div className={styles.skills}>
            {job?.skills?.map((skill) => {
              return <div className={styles.skillTag}>{skill}</div>;
            })}
          </div>
        </div>

        <div>
          <div className={styles.subtitle}>Company overview</div>
          <div>{job?.companyDescription}</div>
        </div>

        <div>
          <div className={styles.subtitle}>Required qualifications</div>
          <div>{job?.qualifications}</div>
        </div>

        <div>
          <div className={styles.subtitle}>Job overview</div>
          <div> {job?.jobDescription}</div>
        </div>
      </div>

      {currUserId === job?.postedBy && (
        <div className={styles.viewApplicantsButton}>
          <Button
            variant="sm"
            btnText="View Applicants"
            onClick={() => navigate(`/jobs/${job._id}/applications`)}
          />
        </div>
      )}
    </div>
  );
}
