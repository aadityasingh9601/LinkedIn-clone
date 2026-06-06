import styles from "./Job.module.css";
import useUserStore from "../../stores/User";
import useJobStore from "../../stores/Job";
import { useState } from "react";
import { Suspense } from "react";
import Options from "../shared-components/Options/Options";
import DeleteModal from "../shared-components/Modal/DeleteModal";
import Modal from "../shared-components/Modal/Modal";
import useComponentVisible from "../../hooks/useComponentVisible";
import Spinner from "../shared-components/Loaders/Spinner";
import JobForm from "./JobForm";

export default function Job({ job }) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const currUserId = useUserStore((state) => state.currUserId);
  const editJob = useJobStore((s) => s.editJob);
  const setcurrJobListingId = useJobStore((s) => s.setcurrJobListingId);
  const deleteJob = useJobStore((s) => s.deleteJob);
  const seteditJob = useJobStore((s) => s.seteditJob);
  const [deleteModal, setDeleteModal] = useState(false);
  const [jobOptions, setjobOptions] = useState(false);

  return (
    <>
      <div className={styles.job} key={job._id}>
        <div className={styles.jobDetails}>
          <div className={styles.img}>
            <img src={job?.companyLogo} />
          </div>
          <div className={styles.jobInfo}>
            <div
              className={styles.title}
              onClick={() => {
                setcurrJobListingId(job._id);
              }}
            >
              {" "}
              {job?.title}
            </div>
            <div className={styles.companyInfo}>{job?.company}</div>
            <div className={styles.companyInfo}>{job?.location}</div>
          </div>
        </div>
        {job.postedBy === currUserId && (
          <div className={styles.options}>
            <Options
              show={isComponentVisible}
              setShow={setIsComponentVisible}
              setEdit={seteditJob}
              setDelete={setDeleteModal}
              dropdownRef={ref}
            />
          </div>
        )}
      </div>

      {editJob && (
        <Modal>
          <Suspense fallback={<Spinner height={40} width={40} />}>
            <JobForm mode="edit" job={job} />
          </Suspense>
        </Modal>
      )}

      {deleteModal && (
        <Modal>
          <DeleteModal
            handleCancel={setDeleteModal}
            handleDelete={() => {
              deleteJob(job._id, setDeleteModal);
            }}
          />
        </Modal>
      )}
    </>
  );
}
