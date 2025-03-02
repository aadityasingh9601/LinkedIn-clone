import "./JobsUI.css";
import { useEffect, useState } from "react";
import Button from "../Button.";
import Job from "./Job";
import Modal from "../Modal";
import CreateJobForm from "./CreateJobForm";
import useJobStore from "../../stores/Job";
import JobDetail from "./JobDetail";

export default function JobsUI() {
  const jobs = useJobStore((state) => state.jobs);
  const postJob = useJobStore((state) => state.postJob);
  const setpostJob = useJobStore((state) => state.setpostJob);
  const fetchAllJobs = useJobStore((state) => state.fetchAllJobs);
  const fetchMyJobs = useJobStore((state) => state.fetchMyJobs);
  const currJobListingId = useJobStore((state) => state.currJobListingId);
  const setcurrJobListingId = useJobStore((state) => state.setcurrJobListingId);
  const currJobDetails = jobs.filter((job) => job._id === currJobListingId);
  const editJob = useJobStore((state) => state.editJob);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <>
      <div className="jobOptions">
        <Button
          btnText="My jobs"
          onClick={() => {
            console.log("clicked");
            fetchMyJobs();
          }}
        />
        <Button
          btnText="Post a free job"
          onClick={() => {
            setcurrJobListingId("");
            setpostJob(true);
          }}
        />
      </div>
      <div className="jobs">
        <div className="jobList">
          <div className="a">
            <h2>Top jobs picks for you!</h2>
          </div>
          <div className="b">
            {jobs.map((job) => {
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
          <CreateJobForm jobData={currJobDetails} />
        </Modal>
      )}
      {editJob && (
        <Modal>
          <CreateJobForm jobData={currJobDetails} />
        </Modal>
      )}
    </>
  );
}
