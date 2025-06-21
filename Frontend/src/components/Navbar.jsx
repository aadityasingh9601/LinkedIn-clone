import "./Navbar.css";
import Button from "./Button.";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, lazy } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

import useProfileStore from "../stores/Profile";
import useUserStore from "../stores/User";
import useNotificationStore from "../stores/Notification";
import useAnalyticStore from "../stores/Analytic";
import MainLogo from "../icons/MainLogo";
import HomeIcon from "../icons/HomeIcon";
import UsersIcon from "../icons/UsersIcon";
import JobIcon from "../icons/JobIcon";
import MsgIcon from "../icons/MsgIcon";
import NotiIcon from "../icons/NotiIcon";
import User from "./User";
import Xmark from "../icons/Xmark";

export default function Navbar() {
  const navigate = useNavigate();
  const userProfiles = useProfileStore((state) => state.userProfiles);
  const fetchProfiles = useProfileStore((state) => state.fetchProfiles);
  const logout = useUserStore((state) => state.logout);

  const [showNetwork, setShowNetworks] = useState(false);

  const [username, setUsername] = useState("");

  const [searchResult, setSearchResult] = useState(false);

  const notiCount = useNotificationStore((state) => state.notiCount);

  const currUserId = useUserStore((state) => state.currUserId);

  const logEvent = useAnalyticStore((state) => state.logEvent);

  //Handle automatic search with debouncing.
  //Using useCallback to ensure the function doesn't gets re-created on every re-render and multipe api calls
  //go the backend.
  const handleSearch = useCallback(
    debounce((searchValue) => {
      fetchProfiles(searchValue);
    }, 1000),
    [] //Add dependency, when this function should create again.
  );

  const handleClick = () => {
    setSearchResult(true);
  };

  const toggle = () => {
    setShowNetworks(!showNetwork);
  };

  return (
    <div className="navbar">
      <MainLogo />
      <input
        className="searchBar"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          // handleSearch.cancel(), Cancels any pending call before scheduling a new one.This ensures only the latest search term
          // triggers an API call after the delay.
          handleSearch.cancel();
          //To ensure no call goes to backend if the value is "".
          if (e.target.value !== "") {
            handleSearch(e.target.value);
          }
        }}
        onClick={handleClick}
        placeholder="Search "
      />

      {searchResult && (
        <div className="allUserProfiles">
          <Xmark onClick={() => setSearchResult(false)} />
          {userProfiles.map((profile) => (
            <User
              url={profile.profileImage.url}
              userId={profile.userId}
              username={profile.name}
              headline={profile.headline}
            />
          ))}
        </div>
      )}

      <Link to={"/home"}>
        <HomeIcon />
        <span>Home</span>
      </Link>
      <Link>
        <UsersIcon />
        <span onClick={toggle}>My Network</span>
      </Link>
      {showNetwork && (
        <div className="myNetwork">
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Manage your network
          </div>
          <div onClick={() => navigate("/network/connections")}>
            <i class="fa-solid fa-users"></i>Connections
          </div>
          <div onClick={() => navigate("/network/followers")}>
            <i class="fa-solid fa-user"></i>Followers
          </div>
          <div onClick={() => navigate("/network/following")}>
            <i class="fa-solid fa-user"></i>Following
          </div>
        </div>
      )}
      <Link to={"/jobs"}>
        <JobIcon />
        <span>Jobs</span>
      </Link>
      <Link>
        <MsgIcon />
        <span>Messaging</span>
      </Link>
      <Link to={"/notifications"}>
        <NotiIcon />

        <span style={{ position: "relative" }}>
          Notifications
          {notiCount > 0 ? (
            <div id="bellIcon-badge">
              <div>{notiCount}</div>
            </div>
          ) : null}
        </span>
      </Link>
      <button
        style={{ backgroundColor: "transparent", border: "none" }}
        onClick={() => {
          navigate(`/profile/${currUserId}`);
        }}
      >
        <img
          src="src/assets/img1.jpg"
          style={{ height: "24px", width: "24px", borderRadius: "50%" }}
        />
        <br></br>
        <span>Me</span>
      </button>
      {/* //This wasn't working initially because passing onClick like this means
      that you are passsing it as a prop //and if u have passed a prop , then
      you also have to receive it in the button component. */}

      <Button btnText="Logout" onClick={() => logout(navigate)}></Button>
    </div>
  );
}
