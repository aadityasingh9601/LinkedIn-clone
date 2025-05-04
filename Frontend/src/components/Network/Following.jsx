import "./Following.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../Button.";
import useProfileStore from "../../stores/Profile";
import { useNavigate } from "react-router-dom";

export default function Following() {
  const navigate = useNavigate();
  const [followings, setFollowings] = useState([]);

  const updateCurrProfileUserId = useProfileStore(
    (state) => state.updateCurrProfileUserId
  );

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const response = await axios.get(
          `http://localhost:8000/follow/following`,
          {
            withCredentials: true,
          }
        );

        console.log(response.data);
        setFollowings(response.data);
      } catch (err) {
        console.log(err);
        return toast.error(err.message);
      }
    }

    fetchFollowing();
  }, []);

  const unfollow = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/follow/${userId}`,

        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setFollowings((prevFollowings) => {
          return prevFollowings.filter((f) => f._id !== userId);
        });
        return toast.success("Unfollowed successfully!");
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
      <h2>People you follow.</h2>
      {followings.length === 0 && (
        <h2 style={{ color: "red" }}>
          Oops! Looks like you aren't following anybody!
        </h2>
      )}
      {followings.map((following) => (
        <div className="follower">
          <Avatar url={following.userFollowed.profile.profileImage.url} />
          <div className="headline">
            <span
              onClick={() => showProfile(following.userFollowed.profile.userId)}
            >
              <b>{following.userFollowed.profile.name}</b>
            </span>
            <br />
            <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
              {following.userFollowed.profile.headline}
            </span>
            <br />
            <Button
              btnText="Unfollow"
              onClick={() => unfollow(following._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
