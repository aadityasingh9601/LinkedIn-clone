import "./Applications.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useJobStore from "../../stores/Job";
import Application from "./Application";

export default function Applications() {
  const { id } = useParams();
  const getAllApplicants = useJobStore((state) => state.getAllApplicants);
  const applicants = useJobStore((state) => state.applicants);
  console.log(id);
  useEffect(() => {
    getAllApplicants(id);
  }, [id]);
  return (
    <>
      <div className="applications">
        {applicants?.length == 0 ? (
          <div
            style={{
              fontSize: "1.5rem",
              border: "1px solid black",
              backgroundColor: "white",
              padding: "1rem",
            }}
          >
            Oops! Looks like there are no applicants for this job currently!
          </div>
        ) : (
          applicants?.map((a) => {
            return <Application application={a} key={a._id} jobId={id} />;
          })
        )}
      </div>
    </>
  );
}
