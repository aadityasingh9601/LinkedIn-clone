import styles from "./JobsUI.module.css";
import { useEffect, useState } from "react";
import Button from "../../components/shared-components/Buttons/Button";
import Job from "../../components/Jobs/Job";
import Modal from "../../components/shared-components/Modal/Modal";
import CreateJobForm from "../../components/Jobs/CreateJobForm";
import useJobStore from "../../stores/Job";
import JobDetail from "../../components/Jobs/JobDetail";

export default function JobsUI() {
  const jobs = useJobStore((s) => s.jobs);
  const postJob = useJobStore((s) => s.postJob);
  const setpostJob = useJobStore((s) => s.setpostJob);
  const getAllJobs = useJobStore((s) => s.getAllJobs);
  const getMyJobs = useJobStore((s) => s.getMyJobs);
  const currJobListingId = useJobStore((s) => s.currJobListingId);
  const setcurrJobListingId = useJobStore((s) => s.setcurrJobListingId);
  const editJob = useJobStore((s) => s.editJob);
  const currJobDetails = jobs.find((job) => job._id === currJobListingId);

  const [myJobs, setmyJobs] = useState(false);

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      <div className={styles.jobOptions}>
        <Button
          btnText="All jobs"
          onClick={() => {
            getAllJobs();
          }}
        />
        <Button
          btnText="My jobs"
          onClick={() => {
            setmyJobs(!myJobs);
          }}
        />
        {myJobs && (
          <div className={styles.myjobsoptions}>
            <Button btnText="Saved" onClick={() => getMyJobs("saved")} />
            <Button btnText="Applied" onClick={() => getMyJobs("applied")} />
          </div>
        )}
        <Button
          btnText="Post a free job"
          onClick={() => {
            setcurrJobListingId("");
            setpostJob(true);
          }}
        />
        <Button
          btnText="Manage job posts"
          onClick={() => {
            getMyJobs("myjobpostings");
          }}
        />
      </div>
      <div className={styles.jobs}>
        <div className={styles.jobList}>
          <div className={styles.a}>
            <h2>Top jobs picks for you!</h2>
          </div>
          <div className="b">
            {jobs?.map((job) => {
              return <Job job={job} />;
            })}
          </div>
        </div>
        {jobs.length > 0 && currJobListingId && (
          <JobDetail job={currJobDetails} />
        )}
      </div>
      {postJob && (
        <Modal>
          <CreateJobForm job={currJobDetails} />
        </Modal>
      )}
      {editJob && (
        <Modal>
          <CreateJobForm job={currJobDetails} />
        </Modal>
      )}
    </>
  );
}
