import { useEffect, useState } from "react";
import "./Profile.css";

import useProfileStore from "../../stores/Profile";
import useFollowStore from "../../stores/Follow";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useAnalyticStore from "../../stores/Analytic";
import useConnectionStore from "../../stores/Connection";
import ProfileHead from "./ProfileHead";
import ProfileSection from "../ProfileSection";

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

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchProfileData(currProfileId);
  }, [currProfileId]);

  const isFollowed = useFollowStore((state) => state.isFollowed);

  let styles = {
    display: currUserId !== currProfileId ? "none" : "inline",
  };

  const setAnalyticsEvent = useAnalyticStore(
    (state) => state.setAnalyticsEvent
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
        isFollowed={isFollowed}
        isConnected={isConnected}
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
