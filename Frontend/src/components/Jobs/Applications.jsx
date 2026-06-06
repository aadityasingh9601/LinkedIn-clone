import styles from "../../pages/Notifications/NotificationBox.module.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useJobStore from "../../stores/Job";
import Application from "./Application";

export default function Applications() {
  const { id } = useParams();
  const getAllApplicants = useJobStore((s) => s.getAllApplicants);
  const applicants = useJobStore((s) => s.applicants);
  console.log(id);
  useEffect(() => {
    getAllApplicants(id);
  }, [id]);
  return (
    <div className={styles.notificationBox}>
      <div className={styles.boxHeader}>All job applications</div>
      <div className={styles.boxBody}>
        {applicants?.length > 0 ? (
          <div >
            {applicants?.map((a) => (
              <Application application={a} key={a._id} jobId={id} />
            ))}
          </div>
        ) : (
          <div className={styles.fallBackUI}>
            Oops! Looks like there are no applicants for this job currently!
          </div>
        )}
      </div>
    </div>
  );
}
