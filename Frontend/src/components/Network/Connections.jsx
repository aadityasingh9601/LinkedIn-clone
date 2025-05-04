import "./Connections.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../Button.";
import useUserStore from "../../stores/User";
import useProfileStore from "../../stores/Profile";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

export default function Followers() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const currUserId = useUserStore((state) => state.currUserId);

  const updateCurrProfileUserId = useProfileStore(
    (state) => state.updateCurrProfileUserId
  );

  useEffect(() => {
    async function fetchConnections(userId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/connection/${userId}`,
          {
            withCredentials: true,
          }
        );

        console.log(response.data);
        setConnections(response.data);
        ///console.log(currUserId !== connections[0].user._id);
      } catch (err) {
        console.log(err);
        return toast.error(err.message);
      }
    }

    fetchConnections(currUserId);
  }, []);

  const removeConnection = async (connectionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/connection/${connectionId}`,
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.status === 200) {
        setConnections((prevConnections) => {
          return prevConnections.filter((c) => c._id !== connectionId);
        });
        return toast.success("Removed successfully!");
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
    <div className="connections">
      <h2>My connections</h2>
      {connections.length === 0 && (
        <h2 style={{ color: "red" }}>
          Oops! You have no connections. Start connecting today!
        </h2>
      )}
      {connections.map((connection) => {
        // Determine the person who is NOT the current user
        const otherPerson =
          currUserId === connection.user._id
            ? connection.connectedUser
            : connection.user;

        return (
          <div className="follower" key={connection._id}>
            <Avatar url={otherPerson.profile?.profileImage?.url} />

            <div className="headline">
              <span onClick={() => showProfile(otherPerson._id)}>
                <b>{otherPerson.profile?.name}</b>
              </span>
              <br />
              <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
                {otherPerson.profile?.headline}
              </span>
              <br />
              <Button
                btnText="Remove"
                onClick={() => removeConnection(connection._id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
