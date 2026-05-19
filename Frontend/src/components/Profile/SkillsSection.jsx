import { useState } from "react";
import indexStyles from "./index.module.css";
import ControlledInput from "../shared-components/Inputs/ControlledInput";
import Button from "../shared-components/Buttons/Button";
import useProfileStore from "../../stores/Profile";
import Spinner from "../shared-components/Loaders/Spinner";
import Trash from "../shared-components/Icons/Trash";
import Plus from "../shared-components/Icons/Plus";

export default function SkillsSection({
  styles,
  profileSkills,
  addInSection,
  setAddInSection,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const addNewSkill = useProfileStore((s) => s.addNewSkill);
  const deleteSkill = useProfileStore((s) => s.deleteSkill);
  const [newSkill, setNewSkill] = useState("");
  const [addSkill, setAddSkill] = useState(false);

  return (
    <div className={indexStyles.profileSection}>
      <div className={indexStyles.head}>
        <div className={indexStyles.title}>Skills</div>
        <div className={indexStyles.icons}>
          <Plus styles={styles} onClick={() => setAddSkill(true)} />
        </div>
      </div>
      <div>
        {addSkill && (
          <div>
            <ControlledInput
              value={newSkill}
              placeholder="Skill"
              onChange={(e) => {
                setNewSkill(e.target.value);
              }}
            />
            <div className={indexStyles.buttonWrapper}>
              <Button
                variant="sm"
                btnText="Cancel"
                onClick={() => setAddSkill(false)}
              />
              <Button
                variant="sm"
                btnText={isLoading ? <Spinner height={17} width={17} /> : "Add"}
                onClick={() => {
                  addNewSkill(newSkill, setIsLoading);
                  setNewSkill("");
                }}
              />
            </div>
          </div>
        )}
        <div>
          {profileSkills?.map((skill, index) => (
            <div key={index} className={indexStyles.skill}>
              <div>{skill}</div>
              <div>
                <Trash styles={styles} onClick={() => deleteSkill(skill)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
