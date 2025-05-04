import "./Followers.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../Button.";
import useProfileStore from "../../stores/Profile";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

export default function Followers() {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);

  const updateCurrProfileUserId = useProfileStore(
    (state) => state.updateCurrProfileUserId
  );

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const response = await axios.get(
          `http://localhost:8000/follow/followers`,
          {
            withCredentials: true,
          }
        );

        console.log(response.data);
        setFollowers(response.data);
      } catch (err) {
        console.log(err);
        return toast.error(err.message);
      }
    }

    fetchFollowers();
  }, []);

  const removeFollower = async (followerId) => {
    console.log(followerId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/follow/${followerId}/remove`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setFollowers((prevFollowers) => {
          return prevFollowers.filter((f) => f._id !== followerId);
        });
        return toast.success("Follower removed!");
      }
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  };

  const showProfile = (userId) => {
    console.log(userId);
    localStorage.setItem("currProfileUserId", userId);

    updateCurrProfileUserId(userId);
    navigate("/profile");
  };

  return (
    <div className="followers">
      <h2>Your Followers</h2>
      {followers.length === 0 && (
        <h2 style={{ color: "red" }}>
          Oops! Looks like you don't have any followers!
        </h2>
      )}
      {followers.map((follower) => (
        <div className="follower">
          <Avatar url={follower.user.profile.profileImage.url} />
          <div className="headline">
            <span onClick={() => showProfile(follower.user.profile.userId)}>
              <b>{follower.user.profile.name}</b>
            </span>
            <br />
            <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
              {follower.user.profile.headline}
            </span>
            <br />
            <Button
              btnText="Remove"
              onClick={() => removeFollower(follower._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
