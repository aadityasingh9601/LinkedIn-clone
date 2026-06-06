import styles from "./JobForm.module.css";
import { useForm } from "react-hook-form";
import useJobStore from "../../stores/Job";
import Button from "../shared-components/Buttons/Button";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import { useState } from "react";
import RHFselect from "../shared-components/Select/RHFselect";
import RHFInput from "../shared-components/Inputs/RHFInput";
import ControlledInput from "../shared-components/Inputs/ControlledInput";
import Xmark from "../shared-components/Icons/Xmark";
import { JobDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../shared-components/Loaders/Spinner";
import FormWrapper from "../shared-components/Forms/FormWrapper";

export default function JobForm({ mode, job = {} }) {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(job?.skills || []);
  const [isLoading, setIsLoading] = useState(false);
  const setpostJob = useJobStore((s) => s.setpostJob);
  const seteditJob = useJobStore((s) => s.seteditJob);
  const createJob = useJobStore((s) => s.createJob);
  const updateJob = useJobStore((s) => s.updateJob);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(JobDataSchema),
    defaultValues: {
      ...job,
    },
  });

  const handleSkillKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const skill = skillInput.trim();

    if (!skill) return;
    if (skills.includes(skill)) return;
    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    setValue("skills", updatedSkills, {
      shouldValidate: true,
    });
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("skills", updatedSkills, {
      shouldValidate: true,
    });
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const jobData = {
      ...data,
      skills: skills,
    };
    {
      mode === "create"
        ? createJob(jobData, setIsLoading)
        : updateJob(jobData, job._id, setIsLoading);
    }
  };

  return (
    <div className={styles.createjobform}>
      <div className={styles.header}>
        {mode === "create" ? "Create" : "Edit"} job posting
      </div>
      <div className={styles.form}>
        <FormWrapper id="jobForm" onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formBody}>
            <RHFInput
              placeholder="Write job title"
              register={register}
              name="title"
              errors={errors}
            />

            <RHFInput
              placeholder="Enter company name"
              name="company"
              register={register}
              errors={errors}
            />

            <RHFInput
              placeholder="Enter company logo url"
              name="companyLogo"
              register={register}
            />

            <RHFtextarea
              register={register}
              errors={errors}
              name="companyDescription"
              placeholder="Enter company description"
            />
            <RHFInput
              placeholder="Company location"
              name="location"
              register={register}
              errors={errors}
            />

            <div className={styles.jobType}>
              <RHFselect
                name="jobType"
                label="Job Type"
                register={register}
                options={["Full-time", "Contract", "Part-time", "Internship"]}
                errors={errors}
              />

              <RHFselect
                name="jobMode"
                label="Job Mode"
                register={register}
                options={["On-site", "Remote"]}
                errors={errors}
              />
            </div>

            <RHFInput
              placeholder="Enter salary"
              name="salary"
              register={register}
            />

            <RHFtextarea
              register={register}
              errors={errors}
              name="qualifications"
              placeholder="Enter qualifications"
            />

            <div>
              <ControlledInput
                type="text"
                placeholder="Enter skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />

              {skills.length === 0 && <div> Required!</div>}

              <div className={styles.skillTags}>
                {skills.map((skill) => (
                  <div key={skill} className={styles.skillTag}>
                    <div>{skill}</div>
                    <div>
                      {" "}
                      <Xmark onClick={() => removeSkill(skill)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <RHFtextarea
              register={register}
              errors={errors}
              name="jobDescription"
              placeholder="Enter job description"
              rules={{
                required: "Job description is required!",
              }}
            />
          </div>
        </FormWrapper>
        <div className={styles.footer}>
          <div className={styles.buttonWrapper}>
            <Button
              btnText="Cancel"
              variant="sm"
              onClick={() => {
                job ? seteditJob(false) : setpostJob(false);
              }}
            />
            <Button
              btnText={
                isLoading ? (
                  <Spinner />
                ) : mode === "edit" ? (
                  "Save Changes"
                ) : (
                  "Submit"
                )
              }
              form="jobForm"
              variant="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
