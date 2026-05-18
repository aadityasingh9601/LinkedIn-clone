import { useState } from "react";
import styles from "./SkillsSection.module.css";
import ControlledInput from "../shared-components/Inputs/ControlledInput";
import Button from "../shared-components/Buttons/Button";
import useProfileStore from "../../stores/Profile";
import Spinner from "../shared-components/Loaders/Spinner";
import Trash from "../shared-components/Icons/Trash";

export default function SkillsSection({ profileSkills }) {
  const [isLoading, setIsLoading] = useState(false);
  const addInSection = useProfileStore((s) => s.addInSection);
  const setAddInSection = useProfileStore((s) => s.setAddInSection);
  const addNewSkill = useProfileStore((s) => s.addNewSkill);
  const deleteSkill = useProfileStore((s) => s.deleteSkill);
  const [newSkill, setNewSkill] = useState("");

  return (
    <div>
      {addInSection && (
        <div>
          <ControlledInput
            value={newSkill}
            placeholder="Skill"
            onChange={(e) => {
              setNewSkill(e.target.value);
            }}
          />
          <div className={styles.buttonWrapper}>
            <Button
              variant="sm"
              btnText="Cancel"
              onClick={() => setAddInSection(false)}
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
          <div key={index} className={styles.skill}>
            <div>{skill}</div>
            <div className="icon">
              <Trash styles={styles} onClick={() => deleteSkill(skill)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
