import "./FullApplication.css";
import { useParams } from "react-router-dom";
import useJobStore from "../../stores/Job";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Envelope from "../../icons/Envelope";

export default function FullApplication() {
  const { id, appId } = useParams();
  const navigate = useNavigate();
  const jobs = useJobStore((state) => state.jobs);
  const job = jobs.find((job) => job._id === id);
  const applicants = useJobStore((state) => state.applicants);

  const application = applicants.find((app) => app._id === appId);

  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (application?.status === "Reviewed") {
      setReviewed(true);
    }
  }, []);

  const showProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const markAsReviewed = useJobStore((state) => state.markAsReviewed);

  const rejectUserApplication = useJobStore(
    (state) => state.rejectUserApplication
  );

  const downloadResume = () => {
    window.open(
      `http://localhost:8000/jobs/resume/${application?.resume.id}`,
      "_blank"
    );
  };
  return (
    <div className="fullApplication">
      <div className="fullapplication-container">
        <div className="fullapplication-header">
          <div style={{ fontSize: "1.4rem", fontWeight: "500" }}>
            {job?.title}
          </div>
          <div>
            <p className="fullapplication-date">
              Applied on {new Date(application?.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px solid black",
            padding: "0.5rem 1rem",
          }}
        >
          <div className="application-left">
            <img
              src={application?.applicant?.profile?.profileImage.url}
              alt="Profile"
              className="application-avatar"
              style={{ height: "4.5rem", width: "4.5rem" }}
            />
            <div className="application-info">
              <div style={{ fontSize: "1.2rem" }}>
                {application?.applicant?.profile.name}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#555" }}>
                {application?.applicant?.profile.headline}
              </div>
              <div style={{ fontSize: "0.85rem" }}>
                <span
                  style={{
                    color: "#0a66c2",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => showProfile(application?.applicant._id)}
                >
                  View Profile
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ marginLeft: "0.5rem", fontSize: "1.1rem" }}>
              <Envelope />
              jane.doe@example.com
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <button className="btn-download" onClick={downloadResume}>
                View Resume
              </button>
            </div>
          </div>
        </div>

        <div className="application-answers">
          <div className="answer">
            <div className="ans-head">Why are you interested in this role?</div>
            <div>{application?.answers[0]}</div>
          </div>

          <div className="answer">
            <div className="ans-head">
              Which skill of yours do you believe will have the most impact in
              this role?
            </div>
            <div>{application?.answers[1]}</div>
          </div>

          <div className="answer">
            <div className="ans-head">
              When would you be able to join if selected?
            </div>
            <div>{application?.answers[2]}</div>
          </div>
        </div>

        <div className="fullapplication-actions">
          {reviewed ? (
            <button
              className="btn-download-hover"
              onClick={() => {
                markAsReviewed(id, appId);
                setReviewed(false);
              }}
            >
              Reviewed
            </button>
          ) : (
            <button
              className="btn-download"
              onClick={() => {
                markAsReviewed(id, appId);
                setReviewed(true);
              }}
            >
              MarkAsReviewed
            </button>
          )}

          <button
            className="btn-download"
            onClick={() => rejectUserApplication(id, appId, navigate)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
