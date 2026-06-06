import styles from "./Application.module.css";
import Button from "../shared-components/Buttons/Button";
import { useNavigate } from "react-router-dom";
import UserInfo from "../shared-components/User/UserInfo";

export default function Application({ application, jobId }) {
  const navigate = useNavigate();
  return (
    <div className={styles.application}>
      <div className={styles.userInfo}>
        <UserInfo
          url={application?.applicant?.profile?.profileImage.url}
          headline={application?.applicant?.profile.headline}
          username={application?.applicant?.profile.name}
          profileId={application?.applicant?.profile._id}
          avatarStyles={{ height: "3rem", width: "3rem" }}
        />
      </div>
      <div className={styles.applicationInfo}>
        {application?.status === "New" ? (
          <div className={styles.newTag}>New</div>
        ) : (
          <div className={styles.reviewedTag}>Reviewed</div>
        )}

        <div>
          <Button
            btnText="View details"
            variant="sm"
            onClick={() =>
              navigate(`/jobs/${jobId}/applications/${application._id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
