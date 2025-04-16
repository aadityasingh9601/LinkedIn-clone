import "./Applications.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useJobStore from "../../stores/Job";

export default function Applications() {
  const { id } = useParams();
  const getAllApplicants = useJobStore((state) => state.getAllApplicants);
  const applicants = useJobStore((state) => state.applicants);
  console.log(id);
  useEffect(() => {
    getAllApplicants(id);
  }, [id]);
  return (
    <div className="applications">
      {applicants?.map((a) => {
        return (
          <div key={a._id}>
            <div>{a._id}</div>
            <div>
              <a
                href={`http://localhost:8000/jobs/resume/${a.resume.filename}`}
                download
                target="_blank"
                rel="noreferrer"
              >
                <button>Download Resume</button>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
