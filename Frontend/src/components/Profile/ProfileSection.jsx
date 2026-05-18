import moduleStyles from "./ProfileSection.module.css";
import Plus from "../shared-components/Icons/Plus";
import Pen from "../shared-components/Icons/Pen";
import useProfileStore from "../../stores/Profile";

export default function ProfileSection({ title,styles,children }) {
  const setEditAbout = useProfileStore((s)=>s.setEditAbout);
  return (
    <div className={moduleStyles.profileSection}>
      <div className={moduleStyles.head}>
        <span>{title}</span>
        <div className={moduleStyles.icons}>
          {title.toLowerCase() == "about" ? (
            <Pen styles={styles} onClick={() => setEditAbout(true)} />
          ) : (
            <Plus styles={styles} onClick={() => setAddSection(true)} />
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
