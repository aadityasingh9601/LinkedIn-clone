import ControlledTextarea from "../shared-components/Textarea/ControlledTextarea";
import styles from "./ProfileAbout.module.css";
import Button from "../shared-components/Buttons/Button";
import { useState } from "react";
import Spinner from "../shared-components/Loaders/Spinner";
import useProfileStore from "../../stores/Profile";
import { useEffect } from "react";

export default function ProfileAbout({ profileId, profileAbout }) {
  console.log(profileAbout);
  const [isLoading, setIsLoading] = useState(false);
  const [about, setAbout] = useState(profileAbout);
  const editAbout = useProfileStore((s) => s.editAbout);
  const setEditAbout = useProfileStore((s) => s.setEditAbout);
  const updateProfileAbout = useProfileStore((s) => s.updateProfileAbout);

  useEffect(() => {
    if (about !== profileAbout) {
      setAbout(profileAbout);
    }
  }, [profileAbout]);

  return editAbout ? (
    <div className={styles.profileAboutForm}>
      <ControlledTextarea
        name="about"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />

      <div className={styles.buttonWrapper}>
        <Button
          variant="sm"
          btnText="Cancel"
          onClick={() => setEditAbout(false)}
        />
        <Button
          btnText={
            isLoading ? <Spinner height={17} width={17} /> : "Save Changes"
          }
          variant="sm"
          onClick={() => {
            updateProfileAbout(profileId, about, setIsLoading);
          }}
        />
      </div>
    </div>
  ) : (
    <div>{profileAbout}</div>
  );
}
