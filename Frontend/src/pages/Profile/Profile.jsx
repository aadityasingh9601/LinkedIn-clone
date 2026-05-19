import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

import useProfileStore from "../../stores/Profile";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useAnalyticStore from "../../stores/Analytic";
import useConnectionStore from "../../stores/Connection";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileSection from "../../components/Profile/ProfileSection";
import ProfileAbout from "../../components/Profile/ProfileAbout";
import EducationSection from "../../components/Profile/EducationSection";
import SkillsSection from "../../components/Profile/SkillsSection";
import ExperienceCard from "../../components/Profile/ExperienceCard";
import ExperienceSection from "../../components/Profile/ExperienceSection";

//this component's size is very huge, make sure to break it down into chunks & also refactor this to separate logic, so that
//it can beomce light & fast.
export default function Profile() {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const [addInSection, setAddInSection] = useState(false);
  const [editSection, setEditSection] = useState(false);

  const getProfileData = useProfileStore((state) => state.getProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);
  const currUserId = useUserStore((state) => state.currUserId);
  const currUserProfile = useUserStore((state) => state.currUserProfile);
  const userProfile =
    currUserProfile?.userId !== currUserId ? profile : currUserProfile;
  const updateAboutSection = useProfileStore((s) => s.updateAboutSection);

  useEffect(() => {
    if (currUserProfile?.userId !== currUserId) {
      getProfileData(currProfileId);
    }
  }, [currProfileId]);

  let customStyles = {
    display: currUserId !== currProfileId ? "none" : "inline",
  };

  const setAnalyticsEvent = useAnalyticStore(
    (state) => state.setAnalyticsEvent,
  );

  const showAnalytics = (e) => {
    let value = e.target.innerText;
    setAnalyticsEvent(value);
    navigate("/analytics");
  };

  return (
    <div className={styles.profile}>
      <ProfileHeader
        profile={userProfile}
        styles={customStyles}
        createProfile={createProfile}
      />

      {currUserId === currProfileId && (
        <div className={styles.profileSection}>
          <div className="head">
            <span>Analytics</span>
          </div>
          <div className={styles.analyticsSection}>
            <div className={styles.analyticBox} onClick={showAnalytics}>
              Followers
            </div>
            <div className={styles.analyticBox} onClick={showAnalytics}>
              Post Impressions
            </div>
            <div className={styles.analyticBox} onClick={showAnalytics}>
              Profile Views
            </div>
            <div className={styles.analyticBox} onClick={showAnalytics}>
              Search Appearances
            </div>
          </div>
        </div>
      )}

      <ProfileAbout
        styles={customStyles}
        profileId={profile._id}
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
