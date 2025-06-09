import Avatar from "./Avatar";
import "./User.css";
import { useNavigate } from "react-router-dom";

export default function User({ url, userId, username, headline }) {
  const navigate = useNavigate();
  return (
    <div className="user" key={userId}>
      <Avatar url={url} />
      <div className="details">
        <span
          className="username"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <b>{username}</b>
        </span>
        <br />
        <span className="headline">{headline}</span>
        <br />
      </div>
    </div>
  );
}
