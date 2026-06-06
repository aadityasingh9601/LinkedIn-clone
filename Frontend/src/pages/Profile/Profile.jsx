import { useEffect } from "react";
import styles from "./Profile.module.css";
import useProfileStore from "../../stores/Profile";
import { useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileAbout from "../../components/Profile/ProfileAbout";
import EducationSection from "../../components/Profile/EducationSection";
import SkillsSection from "../../components/Profile/SkillsSection";
import ExperienceSection from "../../components/Profile/ExperienceSection";
import AnalyticsSection from "../../components/Profile/AnalyticsSection";

export default function Profile() {
  const { id: currProfileId } = useParams();
  const profile = useProfileStore((s) => s.profile);
  const getProfileData = useProfileStore((s) => s.getProfileData);
  const currUserId = useUserStore((state) => state.currUserId);

  useEffect(() => {
    getProfileData(currProfileId);
  }, [currProfileId]);

  let customStyles = {
    display: profile?.userId !== currUserId ? "none" : "inline",
  };

  return (
    <div className={styles.profile}>
      <ProfileHeader styles={customStyles} profile={profile} />

      {currUserId === currProfileId && <AnalyticsSection />}

      <ProfileAbout
        styles={customStyles}
        profileId={profile?._id}
        profileAbout={profile?.about}
      />

      <SkillsSection styles={customStyles} profileSkills={profile?.skills} />

      <EducationSection
        customStyles={customStyles}
        profileEducation={profile?.education}
      />

      <ExperienceSection
        customStyles={customStyles}
        profileExperience={profile?.experience}
      />
    </div>
  );
}
