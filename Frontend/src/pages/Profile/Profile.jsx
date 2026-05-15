import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

import useProfileStore from "../../stores/Profile";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useAnalyticStore from "../../stores/Analytic";
import useConnectionStore from "../../stores/Connection";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileSection from "../../components/Profile/ProfileSection";

//this component's size is very huge, make sure to break it down into chunks & also refactor this to separate logic, so that
//it can beomce light & fast.
export default function Profile() {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);
  const currUserId = useUserStore((state) => state.currUserId);
  const currUserProfile = useUserStore((state) => state.currUserProfile);
  const userProfile = currUserProfile?.userId !== currUserId ? profile : currUserProfile;

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

    // console.log(value);
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
        <div className="profileSection">
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

      <ProfileSection
        title="About"
        profile={userProfile}
        styles={customStyles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Education"
        profile={userProfile}
        styles={customStyles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Skills"
        profile={userProfile}
        styles={customStyles}
        editProfile={createProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Experience"
        profile={userProfile}
        styles={customStyles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />
    </div>
  );
}
