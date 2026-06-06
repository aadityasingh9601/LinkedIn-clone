import styles from "./JobsUI.module.css";
import { useEffect, useState, lazy, Suspense } from "react";
import Button from "../../components/shared-components/Buttons/Button";
import Job from "../../components/Jobs/Job";
import Modal from "../../components/shared-components/Modal/Modal";
import useJobStore from "../../stores/Job";
import Spinner from "../../components/shared-components/Loaders/Spinner";

const CreateJobForm = lazy(() => import("../../components/Jobs/CreateJobForm"));
const JobDetail = lazy(() => import("../../components/Jobs/JobDetail"));

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
            <Button variant="sm" btnText="Saved" onClick={() => getMyJobs("saved")} />
            <Button variant="sm" btnText="Applied" onClick={() => getMyJobs("applied")} />
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
          <div className={styles.header}>Top jobs picks for you!</div>
          <div className="b">
            {jobs?.map((job) => {
              return <Job job={job} />;
            })}
          </div>
        </div>
        <div className={styles.jobDetails}>
          {jobs.length > 0 && currJobListingId && (
            <Suspense fallback={<Spinner height={40} width={40} />}>
              <JobDetail job={currJobDetails} />
            </Suspense>
          )}
        </div>
      </div>

      {postJob && (
        <Modal>
          <Suspense fallback={<Spinner height={40} width={40} />}>
            <CreateJobForm job={currJobDetails} />
          </Suspense>
        </Modal>
      )}
      {editJob && (
        <Modal>
          <Suspense fallback={<Spinner height={40} width={40} />}>
            <CreateJobForm job={currJobDetails} />
          </Suspense>
        </Modal>
      )}
    </>
  );
}
