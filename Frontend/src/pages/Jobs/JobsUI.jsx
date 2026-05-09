import styles from "./JobsUI.module.css";
import { useEffect, useState } from "react";
import Button from "../../components/shared-components/Buttons/Button";
import Job from "../../components/Jobs/Job";
import Modal from "../../components/shared-components/Modal/Modal";
import CreateJobForm from "../../components/Jobs/CreateJobForm";
import useJobStore from "../../stores/Job";
import JobDetail from "../../components/Jobs/JobDetail";

export default function JobsUI() {
  const jobs = useJobStore((state) => state.jobs);
  // console.log(jobs);
  const postJob = useJobStore((state) => state.postJob);
  const setpostJob = useJobStore((state) => state.setpostJob);
  const getAllJobs = useJobStore((state) => state.getAllJobs);
  const getMyJobs = useJobStore((state) => state.getMyJobs);
  const currJobListingId = useJobStore((state) => state.currJobListingId);
  //console.log(currJobListingId);
  const setcurrJobListingId = useJobStore((state) => state.setcurrJobListingId);
  const currJobDetails = jobs.find((job) => job._id === currJobListingId);
  const editJob = useJobStore((state) => state.editJob);

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
