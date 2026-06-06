import styles from "./FullApplication.module.css";
import { useParams } from "react-router-dom";
import useJobStore from "../../stores/Job";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserInfo from "../shared-components/User/UserInfo";
import axiosInstance from "../../utils/api/axiosInstance";

export default function FullApplication() {
  const { id, appId } = useParams();
  const navigate = useNavigate();
  const jobs = useJobStore((s) => s.jobs);
  const applicants = useJobStore((s) => s.applicants);
  const job = jobs.find((job) => job._id === id);

  const application = applicants.find((app) => app._id === appId);
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (application?.status === "Reviewed") {
      setReviewed(true);
    }
  }, []);

  const showProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const markAsReviewed = useJobStore((s) => s.markAsReviewed);
  const rejectUserApplication = useJobStore((s) => s.rejectUserApplication);

  const downloadResume = async () => {
    try {
      const response = await axiosInstance.get(
        `/jobs/resume/${application?.resume.id}`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${application?.resume.filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download resume");
    }
  };
  return (
    <div className={styles.fullApplication}>
      <div className={styles.header}>
        <div className={styles.jobTitle}>{job?.title}</div>
        <div className={styles.date}>
          Applied on{" "}
          {new Date(application?.appliedAt).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </div>
      </div>
      <div className={styles.userInfo}>
        <UserInfo
          url={application?.applicant?.profile?.profileImage.url}
          headline={application?.applicant?.profile.headline}
          username={application?.applicant?.profile.name}
          profileId={application?.applicant?.profile._id}
          avatarStyles={{ height: "3rem", width: "3rem" }}
        />
        <div>
          <button className={styles.customBtn} onClick={downloadResume}>
            View Resume
          </button>
        </div>
      </div>
      <div className={styles.answers}>
        <div className={styles.answer}>
          <div className={styles.ansHeader}>
            Why are you interested in this role?
          </div>
          <div>{application?.answers[0]}</div>
        </div>

        <div className={styles.answer}>
          <div className={styles.ansHeader}>
            Which skill of yours do you believe will have the most impact in
            this role?
          </div>
          <div>{application?.answers[1]}</div>
        </div>

        <div className={styles.answer}>
          <div className={styles.ansHeader}>
            When would you be able to join if selected?
          </div>
          <div>{application?.answers[2]}</div>
        </div>
      </div>
      <div className={styles.footer}>
          <div className={styles.footerBtns}>
            {reviewed ? (
            <button
              className={styles.customBtn}
              onClick={() => {
                markAsReviewed(id, appId);
                setReviewed(false);
              }}
            >
              Reviewed
            </button>
          ) : (
            <button
              className={styles.customBtn}
              onClick={() => {
                markAsReviewed(id, appId);
                setReviewed(true);
              }}
            >
              MarkAsReviewed
            </button>
          )}

          <button
            className={styles.customBtn}
            onClick={() => rejectUserApplication(id, appId, navigate)}
          >
            Reject
          </button>
          </div>
      </div>
    </div>
  );
}
