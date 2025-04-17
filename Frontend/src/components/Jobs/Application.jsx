import "./Application.css";
import Button from "../Button.";
import { useNavigate } from "react-router-dom";

export default function Application({ application, jobId }) {
  const navigate = useNavigate();
  console.log(application);
  return (
    <div className="application-container">
      <div className="application-card">
        <div className="application-left">
          <img
            src={application?.applicant?.profile?.profileImage.url}
            alt="Profile"
            className="application-avatar"
          />
          <div className="application-info">
            <h3>{application?.applicant?.profile.name}</h3>
            <p>{application?.applicant?.profile.headline}</p>
          </div>
        </div>
        <div className="application-right">
          <Button
            btnText="View details"
            onClick={() =>
              navigate(`/jobs/${jobId}/applications/${application._id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
