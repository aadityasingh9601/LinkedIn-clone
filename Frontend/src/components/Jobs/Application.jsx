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
          {application?.status === "New" ? (
            <div
              style={{
                backgroundColor: "rgb(235, 229, 229)",
                borderRadius: "0.3rem",
                fontSize: "0.9rem",
                padding: "0.25rem 0.4rem",
                margin: "0 0.3rem 0 0 ",
              }}
            >
              New
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "rgb(168, 220, 140)",
                borderRadius: "0.3rem",
                fontSize: "0.9rem",
                padding: "0.2rem 0.4rem",
                margin: "0 0 0 0.3rem",
              }}
            >
              Reviewed
            </div>
          )}

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
