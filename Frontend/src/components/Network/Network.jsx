import "./Network.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../Button.";
import User from "../User";
import useUserStore from "../../stores/User";

export default function Network() {
  const { type } = useParams(); // "followers" or "following"
  const [network, setNetwork] = useState([]);
  const currUserId = useUserStore((state) => state.currUserId);

  useEffect(() => {
    async function fetchNetwork() {
      const endpoint =
        type === "followers"
          ? "http://localhost:8000/follow/followers"
          : type === "following"
          ? "http://localhost:8000/follow/following"
          : type === "connections"
          ? `http://localhost:8000/connection/${currUserId}`
          : null;

      try {
        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        setNetwork(response.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch data: " + err.message);
      }
    }

    fetchNetwork();
  }, [type]);

  const handleRemove = async (id) => {
    try {
      const url =
        type === "followers"
          ? `http://localhost:8000/follow/${id}/remove`
          : type === "following"
          ? `http://localhost:8000/follow/${id}`
          : type === "connections"
          ? `http://localhost:8000/connection/${id}`
          : null;

      const response = await axios.delete(url, {
        withCredentials: true,
      });

      console.log(response.data);

      if (response.status === 200) {
        setNetwork((prev) =>
          prev.filter((item) => item._id !== response.data.deletedId)
        );
        toast.success(
          type === "followers"
            ? "Follower removed!"
            : type === "following"
            ? "Unfollowed successfully!"
            : type === "connections"
            ? "Connection removed!"
            : null
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="networks">
      <h2>
        {type === "followers"
          ? "Your Followers"
          : type === "following"
          ? "People You Follow"
          : type === "connections"
          ? "My connections"
          : null}
      </h2>

      {network.length === 0 ? (
        <h2 style={{ color: "red" }}>
          {type === "followers"
            ? "Oops! Looks like you don't have any followers!"
            : type === "following"
            ? "Oops! Looks like you aren't following anybody!"
            : type === "connections"
            ? "Oops! You have no connections. Start connecting today!"
            : null}
        </h2>
      ) : (
        network.map((n) => {
          const user =
            type === "followers"
              ? n.user
              : type === "following"
              ? n.userFollowed
              : type === "connections" //We're trying to find the other person from connections data here.
              ? currUserId === n.user._id
                ? n.connectedUser
                : n.user
              : null;

          if (!user || !user.profile) return null; // Handle edge case

          return (
            <div className="network" key={n._id}>
              <User
                url={user.profile.profileImage?.url}
                headline={user.profile.headline}
                username={user.profile.name}
                userId={user._id}
              />
              <Button
                btnText={type === "following" ? "Unfollow" : "Remove"}
                onClick={() => handleRemove(user._id)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
