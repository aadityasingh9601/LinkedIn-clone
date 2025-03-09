import "./Navbar.css";
import Button from "./Button.";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

import axios from "axios";
import { debounce } from "lodash";

import useProfileStore from "../stores/Profile";
import useUserStore from "../stores/User";
import useNotificationStore from "../stores/Notification";
import useAnalyticStore from "../stores/Analytic";

export default function Navbar({ handleLogout }) {
  const navigate = useNavigate();

  const [showNetwork, setShowNetworks] = useState(false);

  const [username, setUsername] = useState("");

  const [userProfiles, setUserProfiles] = useState([]);

  let searchResultUsers;

  const [searchResult, setSearchResult] = useState(false);

  const notiCount = useNotificationStore((state) => state.notiCount);

  const updateCurrProfileUserId = useProfileStore(
    (state) => state.updateCurrProfileUserId
  );

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
  const showProfile = (userId) => {
    console.log(userId);
    localStorage.setItem("currProfileUserId", userId);

    updateCurrProfileUserId(userId);
    navigate("/profile");
  };

  return (
    <div className="navbar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        data-supported-dps="24x24"
        fill="#0a66c2"
        className="mercado-match"
        width="40"
        height="40"
        focusable="false"
      >
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
      </svg>
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
              <div className="img">
                <img src={profile.profileImage.url} alt="" />
              </div>
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

      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-supported-dps="24x24"
          fill="#666666"
          className="mercado-match"
          width="24"
          height="24"
          focusable="false"
          onClick={() => navigate("/home")}
        >
          <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
        </svg>
        <span>Home</span>
      </a>
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-supported-dps="24x24"
          fill="#666666"
          className="mercado-match"
          width="24"
          height="24"
          focusable="false"
        >
          <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
        </svg>
        <span onClick={toggle}>My Network</span>
      </a>
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
          <div onClick={() => navigate("/connections")}>
            <i class="fa-solid fa-users"></i>Connections
          </div>
          <div onClick={() => navigate("/followers")}>
            <i class="fa-solid fa-user"></i>Followers
          </div>
          <div onClick={() => navigate("/following")}>
            <i class="fa-solid fa-user"></i>Following
          </div>
        </div>
      )}
      <a href="#">
        <svg
          onClick={() => navigate("/jobs")}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-supported-dps="24x24"
          fill="#666666"
          className="mercado-match"
          width="24"
          height="24"
          focusable="false"
        >
          <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z"></path>
        </svg>
        <span>Jobs</span>
      </a>
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-supported-dps="24x24"
          fill="#666666"
          className="mercado-match"
          width="24"
          height="24"
          focusable="false"
        >
          <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
        </svg>
        <span>Messaging</span>
      </a>
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-supported-dps="24x24"
          fill="#666666"
          className="mercado-match"
          width="24"
          height="24"
          focusable="false"
          onClick={() => navigate("/notifications")}
        >
          <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
        </svg>
        <span>Notifications</span>
        {notiCount > 0 ? <span id="bellIcon-badge">{notiCount}</span> : null}
      </a>
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

      <Button btnText="Logout" onClick={handleLogout}></Button>
      <Button btnText="ChatUI" onClick={() => navigate("/chatui")}></Button>
    </div>
  );
}
