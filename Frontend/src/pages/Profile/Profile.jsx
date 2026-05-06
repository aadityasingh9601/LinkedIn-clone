import { useEffect, useState } from "react";
import "./Profile.css";

import useProfileStore from "../../stores/Profile";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useAnalyticStore from "../../stores/Analytic";
import useConnectionStore from "../../stores/Connection";
import ProfileHead from "../../components/Profile/ProfileHead";
import ProfileSection from "../../components/Profile/ProfileSection";

//this component's size is very huge, make sure to break it down into chunks & also refactor this to separate logic, so that
//it can beomce light & fast.
export default function Profile() {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  // console.log(profile);
  const fetchProfileData = useProfileStore((state) => state.fetchProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);

  const currUserId = useUserStore((state) => state.currUserId);

  useEffect(() => {
    fetchProfileData(currProfileId);
  }, [currProfileId]);

  let styles = {
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
    <div className="profile">
      <ProfileHead
        profile={profile}
        styles={styles}
        createProfile={createProfile}
      />

      {currUserId === currProfileId && (
        <div className="profileSection">
          <div className="head">
            <span>Analytics</span>
          </div>
          <div className="bodyyy">
            <div onClick={showAnalytics}>Followers</div>
            <div onClick={showAnalytics}>Post Impressions</div>
            <div onClick={showAnalytics}>Profile Views</div>
            <div onClick={showAnalytics}>Search Appearances</div>
          </div>
        </div>
      )}

      <ProfileSection
        title="About"
        profile={profile}
        styles={styles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Education"
        profile={profile}
        styles={styles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Skills"
        profile={profile}
        styles={styles}
        editProfile={createProfile}
        deleteProfile={deleteProfile}
      />

      <ProfileSection
        title="Experience"
        profile={profile}
        styles={styles}
        editProfile={editProfile}
        deleteProfile={deleteProfile}
      />
    </div>
  );
}
