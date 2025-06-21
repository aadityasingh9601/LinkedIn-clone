import "./Network.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Button.";
import User from "../User";
import useUserStore from "../../stores/User";
import useNetworkStore from "../../stores/Network";

export default function Network() {
  const { type } = useParams(); // "followers" or "following"
  console.log(type);
  const network = useNetworkStore((state) => state.network);
  const currUserId = useUserStore((state) => state.currUserId);
  const fetchNetwork = useNetworkStore((state) => state.fetchNetwork);
  const handleRemove = useNetworkStore((state) => state.handleRemove);

  useEffect(() => {
    fetchNetwork(type, currUserId);
  }, [type]);

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
                onClick={() => handleRemove(type, user._id)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
