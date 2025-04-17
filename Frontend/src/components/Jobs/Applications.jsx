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
        {applicants?.map((a) => {
          return <Application application={a} key={a._id} jobId={id} />;
        })}
      </div>
    </>
  );
}
