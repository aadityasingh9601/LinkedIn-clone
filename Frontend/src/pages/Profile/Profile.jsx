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
import AnalyticsSection from "../../components/Profile/AnalyticsSection";

//this component's size is very huge, make sure to break it down into chunks & also refactor this to separate logic, so that
//it can beomce light & fast.
export default function Profile() {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);

  const getProfileData = useProfileStore((state) => state.getProfileData);
  const currUserId = useUserStore((state) => state.currUserId);
  const currUserProfile = useUserStore((state) => state.currUserProfile);
  const userProfile =
    currUserProfile?.userId !== currUserId ? profile : currUserProfile;

  useEffect(() => {
    if (currUserProfile?.userId !== currUserId) {
      getProfileData(currProfileId);
    }
  }, [currProfileId]);

  let customStyles = {
    display: currUserId !== currProfileId ? "none" : "inline",
  };

  return (
    <div className={styles.profile}>
      <ProfileHeader
      styles={customStyles}
        profile={userProfile}
      />

      {currUserId === currProfileId && <AnalyticsSection />}

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
