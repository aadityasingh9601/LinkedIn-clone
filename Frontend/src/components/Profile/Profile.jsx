import { useEffect, useState } from "react";
import "./Profile.css";
import Button from "../Button.";
import EducationCard from "./EducationCard";
import ExpCard from "./ExpCard";

import useProfileStore from "../../stores/Profile";
import useFollowStore from "../../stores/Follow";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useAnalyticStore from "../../stores/Analytic";
import useConnectionStore from "../../stores/Connection";
import ControlledTextarea from "../ControlledTextarea";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import ProfileHead from "./ProfileHead";
import Pen from "../../icons/Pen";
import Trash from "../../icons/Trash";
import Plus from "../../icons/Plus";
import ControlledInput from "../ControlledInput";
import ProfileSection from "../ProfileSection";

export default function Profile({ socket }) {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  // console.log(profile);
  const fetchProfileData = useProfileStore((state) => state.fetchProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);

  const sendConnReq = useConnectionStore((state) => state.sendConnReq);
  const checkConn = useConnectionStore((state) => state.checkConn);
  const currUserId = useUserStore((state) => state.currUserId);

  const editSkills = useProfileStore((state) => state.editSkills);
  const setEditSkills = useProfileStore((state) => state.setEditSkills);
  const addExperience = useProfileStore((state) => state.addExperience);
  const setAddExperience = useProfileStore((state) => state.setAddExperience);
  const addEducation = useProfileStore((state) => state.addEducation);
  const setAddEducation = useProfileStore((state) => state.setAddEducation);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchProfileData(currProfileId);
  }, [currProfileId]);

  const isFollowed = useFollowStore((state) => state.isFollowed);

  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

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
        <div className="section">
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
