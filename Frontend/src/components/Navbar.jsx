import "./Navbar.css";
import Button from "./Button.";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, lazy } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
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
const Avatar = lazy(() => import("./Avatar"));

export default function Navbar() {
  const navigate = useNavigate();

  const logout = useUserStore((state) => state.logout);

  const [showNetwork, setShowNetworks] = useState(false);

  const [username, setUsername] = useState("");

  const [userProfiles, setUserProfiles] = useState([]);

  let searchResultUsers;

  const [searchResult, setSearchResult] = useState(false);

  const notiCount = useNotificationStore((state) => state.notiCount);

  const currUserId = useUserStore((state) => state.currUserId);

  const logEvent = useAnalyticStore((state) => state.logEvent);

  async function fetchProfiles(username) {
    try {
      const response = await axios.post(
        `http://localhost:8000/profile/allUsers`,
        { username },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        setUserProfiles(response.data);

        //Triggering log event for search appearances.
        searchResultUsers = response.data.map((u) => {
          return u.userId;
        });

        let eventData = {
          eventType: "search_appearance",
          users: searchResultUsers,
        };

        logEvent(eventData);

        console.log(searchResultUsers);
      }

      if (response.status === 404) {
        setUserProfiles("No users found!");
      }
    } catch (err) {
      console.log(err);
    }
  }

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

  //So what we are finally doing is that we have kept the useEffect in profile.jsx to fetch the profile data same,
  //we have defined a new variable named currProfileUserId that stores the userId of the person, whose profile we
  //want to visit, and passed this variable to our useEffect , that re-renders the component each time our
  //currUserProfile changes , currUserProfile is a state variable that gets it's value from the local storage
  //and as someone tries to visit a user's profile, then the value of currUserProfileId gets updated in the local
  //storage and the state variable as well, means the profile component now re-renders and fetches new data from the
  //backend.Remember this to implement later too whenever needed.
  //We don't need local storage for this now, we can use dynamic routes.
  const showProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="navbar">
      <MainLogo />
      <input
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
        style={{
          backgroundColor: "#edf3f8",
          height: "34px",
          width: "280px",
          border: "none",
          margin: "0 8rem 0 0.7rem",
        }}
      />

      {searchResult && (
        <div className="allUserProfiles">
          <i
            class="fa-solid fa-xmark cross"
            onClick={() => setSearchResult(false)}
          ></i>
          {userProfiles.map((profile) => (
            <div className="userProfile">
              <Avatar url={profile.profileImage.url} />
              <div className="headline">
                <span onClick={() => showProfile(profile.userId)}>
                  <b>{profile.name}</b>
                </span>
                <br />
                <span
                  style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}
                >
                  {profile.headline}
                </span>
              </div>
            </div>
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
          showProfile(currUserId);
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
