import ControlledTextarea from "../shared-components/Textarea/ControlledTextarea";
import indexStyles from "./index.module.css";
import Button from "../shared-components/Buttons/Button";
import { useState } from "react";
import Spinner from "../shared-components/Loaders/Spinner";
import useProfileStore from "../../stores/Profile";
import { useEffect } from "react";
import Pen from "../shared-components/Icons/Pen";

export default function ProfileAbout({styles, profileId, profileAbout }) {
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

  return (
    <div className={indexStyles.profileSection}>
      <div className={indexStyles.head}>
        <div className={indexStyles.title}>About</div>
        <div className={indexStyles.icons}>
            <Pen styles={styles} onClick={() => setEditAbout(true)} />
        </div>
      </div>
      <div>
        {editAbout ? (
          <div>
            <ControlledTextarea
              name="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <div className={indexStyles.buttonWrapper}>
              <Button
                variant="sm"
                btnText="Cancel"
                onClick={() => setEditAbout(false)}
              />
              <Button
                btnText={
                  isLoading ? (
                    <Spinner height={17} width={17} />
                  ) : (
                    "Save Changes"
                  )
                }
                variant="sm"
                onClick={() => {
                  updateProfileAbout(about, setIsLoading);
                }}
              />
            </div>
          </div>
        ) : (
          <div>{profileAbout}</div>
        )}
      </div>
    </div>
  );
}
