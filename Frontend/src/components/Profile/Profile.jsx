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

export default function Profile({ socket }) {
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  console.log(profile);
  const fetchProfileData = useProfileStore((state) => state.fetchProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);

  const sendConnReq = useConnectionStore((state) => state.sendConnReq);
  const checkConn = useConnectionStore((state) => state.checkConn);

  const currUserId = useUserStore((state) => state.currUserId);

  const newSkill = useProfileStore((state) => state.newSkill);
  const setNewSkill = useProfileStore((state) => state.setNewSkill);

  const editSkills = useProfileStore((state) => state.editSkills);
  const setEditSkills = useProfileStore((state) => state.setEditSkills);

  const editAbout = useProfileStore((state) => state.editAbout);
  const setEditAbout = useProfileStore((state) => state.setEditAbout);

  const addExperience = useProfileStore((state) => state.addExperience);
  const setAddExperience = useProfileStore((state) => state.setAddExperience);

  const addEducation = useProfileStore((state) => state.addEducation);
  const setAddEducation = useProfileStore((state) => state.setAddEducation);

  const setAbout = useProfileStore((state) => state.setAbout);

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
            <span style={{ margin: "0 0 1.5rem 0" }}>Analytics</span>
          </div>
          <div className="bodyyy">
            <div onClick={showAnalytics}>Followers</div>
            <div onClick={showAnalytics}>Post Impressions</div>
            <div onClick={showAnalytics}>Profile Views</div>
            <div onClick={showAnalytics}>Search Appearances</div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="head">
          <span style={{ margin: "0 0 1.5rem 0" }}>About</span>
          <div className="icons">
            <Pen styles={styles} onClick={() => setEditAbout(true)} />
          </div>
        </div>
        <div className="bodyy">
          {editAbout ? (
            <>
              <ControlledTextarea
                name="about"
                value={profile.about}
                onChange={(e) => setAbout(e.target.value)}
              />
              <Button btnText="Cancel" onClick={() => setEditAbout(false)} />
              <Button
                btnText="Save Changes"
                onClick={() =>
                  editProfile({ section: "about", newData: profile.about })
                }
              />
            </>
          ) : (
            <span>{profile.about}</span>
          )}
        </div>
      </div>

      <div className="section">
        <div className="head">
          <span style={{ margin: "0 0 1.5rem 0" }}>Education</span>
          <div className="icons">
            <Plus styles={styles} onClick={() => setAddEducation(true)} />
          </div>
        </div>
        <div className="bodyy">
          {addEducation && (
            <EducationForm
              updateVisState={(value) => {
                setAddEducation(value);
              }}
            />
          )}
          <div className="educationList">
            {profile.education?.map((education) => {
              return (
                <EducationCard
                  key={education._id}
                  education={education}
                  editProfile={editProfile}
                  deleteProfile={deleteProfile}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="head">
          <span style={{ margin: "0 0 1.5rem 0" }}>Skills</span>
          <div className="icons">
            <Plus styles={styles} onClick={() => setEditSkills(true)} />
          </div>
        </div>
        <div className="bodyy">
          {editSkills && (
            <>
              <ControlledInput
                value={newSkill}
                placeholder="Skill"
                onChange={(e) => {
                  setNewSkill(e.target.value);
                }}
              />

              <Button btnText="Cancel" onClick={() => setEditSkills(false)} />
              <Button
                btnText="Add"
                onClick={() => createProfile({ skill: newSkill })}
              />
            </>
          )}
          <div>
            {profile.skills?.map((skill, index) => (
              <div key={index} className="skill">
                <div>{skill}</div>
                <div className="icon">
                  <Trash
                    styles={styles}
                    onClick={() => deleteProfile({ skill: skill })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="head">
          <span style={{ margin: "0 0 1.5rem 0" }}>Experience</span>
          <div className="icons">
            <Plus styles={styles} onClick={() => setAddExperience(true)} />
          </div>
        </div>
        <div className="bodyy">
          {addExperience && (
            <ExperienceForm
              updateVisState={(value) => setAddExperience(value)}
            />
          )}
          <div className="educationList">
            {profile.experience?.map((experience) => {
              return (
                <ExpCard
                  key={experience._id}
                  experience={experience}
                  editProfile={editProfile}
                  deleteProfile={deleteProfile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
