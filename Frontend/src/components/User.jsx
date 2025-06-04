import React from "react";
import Avatar from "./Avatar";
import "./User.css";

export default function User({ url, userId, username, headline }) {
  return (
    <div className="user">
      <Avatar url={url} />
      <div className="details">
        <span className="username" onClick={() => showProfile(userId)}>
          <b>{username}</b>
        </span>
        <br />
        <span className="headline">{headline}</span>
        <br />
      </div>
    </div>
  );
}
