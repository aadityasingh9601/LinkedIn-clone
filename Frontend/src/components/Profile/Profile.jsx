import { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import Button from "../Button.";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import EducationCard from "./EducationCard";
import ExpCard from "./ExpCard";
import Modal from "../Modal";
import Chart from "../analytics/Chart";
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
  const { id: currProfileId } = useParams();
  console.log(currProfileId);

  const navigate = useNavigate();
  const currUserId = useUserStore((state) => state.currUserId);
  const fetchAllMsg = useChatStore((state) => state.fetchAllMsg);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const profile = useProfileStore((state) => state.profile);
  const handleChange1 = useProfileStore((state) => state.handleChange1);
  const fetchProfileData = useProfileStore((state) => state.fetchProfileData);
  const currProfileUserId = useProfileStore((state) => state.currProfileUserId);
  console.log(currProfileUserId);

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

  const [editAbout, setEditAbout] = useState(false);
  const [editHead, setEditHead] = useState(false);

  const [editSkills, setEditSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [addEducation, setAddEducation] = useState(false);
  const [addExperience, setAddExperience] = useState(false);

  const isFollowed = useFollowStore((state) => state.isFollowed);
  const checkFollow = useFollowStore((state) => state.checkFollow);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

  const handleChange2 = (e) => {
    setNewSkill(e.target.value);
  };

  const createProfile = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `http://localhost:8000/profile/${currUserId}`,
        {
          data,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        if (data.skill) {
          setProfile((prevProfile) => {
            return { ...profile, skills: [...prevProfile.skills, newSkill] };
          });
          setNewSkill("");
          setEditSkills(false);
        }

        if (data.education) {
          setProfile((prevProfile) => {
            return {
              ...prevProfile,

              education: response.data.education,
              //Our backend is sending the whole profile object , so the most we can do is to just replace the
              //whole education array with the updated education array, and it won't compromising performance
              //that much , because of the reason ChatGPT told u , add that to notes later.
            };
          });
          setAddEducation(false);
        }

        if (data.experience) {
          setProfile((prevProfile) => {
            return {
              ...prevProfile,

              experience: response.data.experience,
            };
          });
          setAddExperience(false);
        } else {
          //Update the profile object here in a way that doesn't ruin performance of the app.

          setProfile((prevProfile) => {
            return {
              ...prevProfile,

              name: response.data.name,
              headline: response.data.headline,
              location: response.data.location,
              contactInfo: response.data.contactInfo,
              profileImage: response.data.profileImage,
              bannerImage: response.data.bannerImage,
            };
          });

          setEditHead(false);
        }

        return toast.success("Added successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editProfile = async (data) => {
    console.log(data);
    const { section, sectionId } = data;
    try {
      const response = await axios.patch(
        `http://localhost:8000/profile/${userId}`,
        { data },
        { withCredentials: true }
      );

      console.log(response);
      if (response.status === 200) {
        if (section === "about") {
          setEditAbout(false);
          return toast.success("Updated successfully");
        }

        if (section === "education") {
          setProfile((prevProfile) => {
            return { ...prevProfile, education: response.data.education };
          });
          return toast.success("Updated successfully");
        }

        if (section === "experience") {
          setProfile((prevProfile) => {
            return { ...prevProfile, experience: response.data.experience };
          });
          return toast.success("Updated successfully");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Delete method doesn't supports a request body, so we are using query parameters instead.
  const deleteProfile = async (data) => {
    let { skill, section, sectionId } = data;
    console.log(section);
    console.log(sectionId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/profile/${userId}?skill=${skill}&section=${section}&sectionId=${sectionId}`,

        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        if (skill) {
          setProfile((prevProfile) => {
            return {
              ...prevProfile,
              skills: prevProfile.skills.filter((s) => s !== skill),
            };
          });
        }

        if (section === "education") {
          setProfile((prevProfile) => {
            const updatedEducation = prevProfile.education.filter(
              (e) => e._id !== sectionId
            );

            return {
              ...prevProfile,
              education: updatedEducation,
            };
          });
        }

        if (section === "experience") {
          setProfile((prevProfile) => {
            const updatedExperience = prevProfile.experience.filter(
              (e) => e._id !== sectionId
            );

            return {
              ...prevProfile,
              experience: updatedExperience,
            };
          });
        }

        return toast.success("Deleted successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
                onChange={handleChange2}
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
