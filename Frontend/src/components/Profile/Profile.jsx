import { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import Button from "../Button.";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import EducationCard from "./EducationCard";
import ExpCard from "./ExpCard";
import Modal from "../Modal";
import ProfileHeadForm from "./ProfileHeadForm";
import useProfileStore from "../../stores/Profile";
import useFollowStore from "../../stores/Follow";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/User";
import useChatStore from "../../stores/Chat";
import PDF from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useAnalyticStore from "../../stores/Analytic";

export default function Profile({ socket }) {
  console.log("rendered");
  const { id: currProfileId } = useParams();
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const handleChange1 = useProfileStore((state) => state.handleChange1);
  const fetchProfileData = useProfileStore((state) => state.fetchProfileData);
  const createProfile = useProfileStore((state) => state.createProfile);
  const editProfile = useProfileStore((state) => state.editProfile);
  const deleteProfile = useProfileStore((state) => state.deleteProfile);

  const currUserId = useUserStore((state) => state.currUserId);
  const fetchAllMsg = useChatStore((state) => state.fetchAllMsg);

  const newSkill = useProfileStore((state) => state.newSkill);
  const setNewSkill = useProfileStore((state) => state.setNewSkill);

  const editSkills = useProfileStore((state) => state.editSkills);
  const setEditSkills = useProfileStore((state) => state.setEditSkills);

  const editAbout = useProfileStore((state) => state.editAbout);
  const setEditAbout = useProfileStore((state) => state.setEditAbout);

  const editHead = useProfileStore((state) => state.editHead);
  const setEditHead = useProfileStore((state) => state.setEditHead);

  const addExperience = useProfileStore((state) => state.addExperience);
  const setAddExperience = useProfileStore((state) => state.setAddExperience);

  const addEducation = useProfileStore((state) => state.addEducation);
  const setAddEducation = useProfileStore((state) => state.setAddEducation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const [isConnected, setIsConnected] = useState(false);

  const fullChat = useChatStore((state) => state.fullChat);
  const setfullChat = useChatStore((state) => state.setfullChat);

  useEffect(() => {
    fetchProfileData(currProfileId);
  }, [currProfileId]);

  useEffect(() => {
    async function checkConn(userId) {
      try {
        console.log(userId);
        const response = await axios.post(
          `http://localhost:8000/connection/checkConn/${userId}`,
          {},
          { withCredentials: true }
        );
        console.log(response);
        if (response.data === "yes") {
          setIsConnected(true);
        }
      } catch (e) {
        console.log(e);
      }
    }

    checkConn(currProfileId);
  }, [currProfileId]);

  useEffect(() => {
    checkFollow(currProfileId);
  }, []);

  const isFollowed = useFollowStore((state) => state.isFollowed);
  const checkFollow = useFollowStore((state) => state.checkFollow);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

  const onSubmit = (education) => {
    console.log(education);
    createProfile({ education: education });
    reset();
  };

  const onSubmit2 = (experience) => {
    console.log(experience);
    createProfile({ experience: experience });
    reset();
  };

  async function sendConnReq(userId) {
    console.log(userId);
    try {
      let response = await axios.post(
        `http://localhost:8000/connection/${userId}`,
        {},
        {
          withCredentials: true, // This includes cookies and credentials in the request, and our cookie has our
          //token in it, so we don't need to send our headers anymore.
        }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMessage() {
    console.log("inside handlemsg");
    try {
      const response = await axios.post(
        `http://localhost:8000/chat/createchat/${currProfileId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setfullChat(true, response.data.chatId);

      fetchAllMsg(response.data.chatId);
      //Emit socket event to join the user in the currChatId room.
      socket.emit("join-room", response.data.chatId);
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  }

  //To ensure that we can't scroll the page while the modal is open.
  if (editHead) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

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
      <div className="main">
        <div className="banner">
          <img src={profile.bannerImage?.url} alt="" />
        </div>
        <div className="profilePic">
          <img src={profile.profileImage?.url} alt="" />
        </div>
        <div className="text">
          <i
            class="fa-solid fa-pen"
            style={styles}
            onClick={() => setEditHead(true)}
          ></i>
          <h2>{profile.name}</h2>
          <p>{profile.headline}</p>
          <p>
            {profile.location}
            <a href="#">
              <span>{profile.contactInfo?.email}</span>
              <span>{profile.contactInfo?.phone}</span>
            </a>
          </p>
          <span
            style={{
              margin: "0 0.7rem 0 0",
              color: "rgba(135, 130, 130)",
              fontSize: "0.9rem",
            }}
          >
            {profile.followerCount} followers
          </span>
          <span
            style={{
              margin: "0 0.7rem 0 0",
              color: "rgba(135, 130, 130)",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            {profile.connCount} connections
          </span>
        </div>
        <div className="allOptions">
          {currUserId !== profile.userId && (
            <>
              {isFollowed ? (
                <Button
                  btnText=" Following "
                  onClick={() => unfollow(currProfileId)}
                />
              ) : (
                <Button
                  btnText="Follow"
                  onClick={() => follow(currProfileId)}
                />
              )}
              <Button btnText="Message" onClick={() => handleMessage()} />
              {!isConnected && (
                <Button
                  btnText="Connect"
                  onClick={() => sendConnReq(profile.userId)}
                />
              )}
            </>
          )}
          <button className="downloadPdf">
            <PDFDownloadLink
              document={<PDF user={profile} />}
              fileName="Profile.pdf"
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </button>
        </div>
      </div>

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
            {/* <div style={{ backgroundColor: "beige" }}>
            <Chart data={analyticsData} />
          </div> */}
          </div>
        </div>
      )}

      <div className="section">
        <div className="head">
          <span style={{ margin: "0 0 1.5rem 0" }}>About</span>
          <div className="icons">
            <i
              class="fa-solid fa-pen"
              style={styles}
              onClick={() => setEditAbout(true)}
            ></i>
          </div>
        </div>
        <div className="bodyy">
          {editAbout ? (
            <>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange1}
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
            <i
              class="fa-solid fa-plus"
              onClick={() => setAddEducation(true)}
              style={styles}
            ></i>
          </div>
        </div>
        <div className="bodyy">
          {addEducation && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Enter institution"
                {...register("institution", {
                  required: "Institution is required",
                  minLength: {
                    value: 5,
                    message: "Institution should be at least 5 characters",
                  },
                })}
              />
              {errors.institution && <p>{errors.institution.message}</p>}

              <input
                placeholder="Enter degree"
                {...register("degree", {
                  required: "Degree is required",
                  minLength: {
                    value: 2,
                    message: "Degree should be at least 2 characters",
                  },
                })}
              />

              <input
                placeholder="Enter start date (yyyy-mm-dd) "
                {...register("started", {
                  required: "Date is required",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Date must be in yyyy-mm-dd format",
                  },
                })}
              />

              {errors.started && <p>{errors.started.message}</p>}

              <input
                placeholder="Enter end date (yyyy-mm-dd)"
                {...register("ended", {
                  required: "Date is required",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Date must be in yyyy-mm-dd format",
                  },
                })}
              />

              {errors.ended && <p>{errors.ended.message}</p>}

              <Button btnText="Cancel" onClick={() => setAddEducation(false)} />
              <Button btnText="Add" />
            </form>
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
            <i
              class="fa-solid fa-plus"
              style={styles}
              onClick={() => setEditSkills(true)}
            ></i>
          </div>
        </div>
        <div className="bodyy">
          {editSkills && (
            <>
              <input
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
                  <i
                    class="fa-solid fa-trash"
                    style={styles}
                    onClick={() => deleteProfile({ skill: skill })}
                  ></i>
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
            <i
              class="fa-solid fa-plus"
              style={styles}
              onClick={() => setAddExperience(true)}
            ></i>
          </div>
        </div>
        <div className="bodyy">
          {addExperience && (
            <form onSubmit={handleSubmit(onSubmit2)}>
              <input
                placeholder="Enter company name"
                {...register("companyName", {
                  required: "Company name is required",
                  minLength: {
                    value: 5,
                    message: "Company name should be at least 5 characters",
                  },
                })}
              />
              {errors.companyName && <p>{errors.companyName.message}</p>}

              <input
                placeholder="Enter job title"
                {...register("jobTitle", {
                  required: "Job title is required",
                  minLength: {
                    value: 2,
                    message: "Job title should be at least 2 characters",
                  },
                })}
              />

              <input
                placeholder="Enter start date (yyyy-mm-dd) "
                {...register("started", {
                  required: "Date is required",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Date must be in yyyy-mm-dd format",
                  },
                })}
              />

              {errors.started && <p>{errors.started.message}</p>}

              <input
                placeholder="Enter end date (yyyy-mm-dd)"
                {...register("ended", {
                  required: "Date is required",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Date must be in yyyy-mm-dd format",
                  },
                })}
              />

              {errors.ended && <p>{errors.ended.message}</p>}

              <textarea
                placeholder="Write your job description here..."
                {...register("description")}
              />

              <Button
                btnText="Cancel"
                onClick={() => setAddExperience(false)}
              />
              <Button btnText="Add" />
            </form>
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

      {editHead && (
        <Modal>
          <i
            class="fa-solid fa-xmark cross"
            style={styles}
            onClick={() => setEditHead(false)}
          ></i>
          <ProfileHeadForm profile={profile} createProfile={createProfile} />
        </Modal>
      )}
    </div>
  );
}
