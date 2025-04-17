import "./FullApplication.css";
import { useParams } from "react-router-dom";
import useJobStore from "../../stores/Job";
import Button from "../Button.";

export default function FullApplication() {
  const { id, appId } = useParams();
  const jobs = useJobStore((state) => state.jobs);
  const job = jobs.find((job) => job._id === id);
  const applicants = useJobStore((state) => state.applicants);

  const application = applicants.find((app) => app._id === appId);
  console.log(application);

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
                <a
                  href="#"
                  style={{ color: "#0a66c2", textDecoration: "none" }}
                >
                  View Profile
                </a>
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
              <i class="fa-solid fa-envelope"></i> jane.doe@example.com
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
          <button className="btn-download">MarkAsReviewed</button>
          <button className="btn-download">Reject</button>
        </div>
      </div>
    </div>
  );
}
