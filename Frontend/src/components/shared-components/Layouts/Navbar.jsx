import styles from "./Navbar.module.css";
import Button from "../Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, lazy } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import useProfileStore from "../../../stores/Profile";
import useUserStore from "../../../stores/User";
import useNotificationStore from "../../../stores/Notification";
import useAnalyticStore from "../../../stores/Analytic";
import MainLogo from "../Icons/MainLogo";
import HomeIcon from "../Icons/HomeIcon";
import UsersIcon from "../Icons/UsersIcon";
import JobIcon from "../Icons/JobIcon";
import MsgIcon from "../Icons/MsgIcon";
import NotiIcon from "../Icons/NotiIcon";
import UserInfo from "../User/UserInfo";
import Xmark from "../Icons/Xmark";
import ControlledInput from "../Inputs/ControlledInput";
import UserAvatar from "../User/UserAvatar";
import UserIcon from "../Icons/UserIcon";
import useComponentVisible from "../../../hooks/useComponentVisible";

export default function Navbar({ showMessaging }) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const navigate = useNavigate();
  const userProfiles = useProfileStore((s) => s.userProfiles);
  const getProfiles = useProfileStore((s) => s.getProfiles);
  const logout = useUserStore((s) => s.logout);
  const currUserId = useUserStore((s) => s.currUserId);
  const currUserProfileId = useUserStore((s) => s.currUserProfileId);

  const [showNetwork, setShowNetworks] = useState(false);

  const [username, setUsername] = useState("");

  const [searchResult, setSearchResult] = useState(false);

  const notiCount = useNotificationStore((state) => state.notiCount);

  const logEvent = useAnalyticStore((state) => state.logEvent);

  //Handle automatic search with debouncing.
  //Using useCallback to ensure the function doesn't gets re-created on every re-render and multipe api calls
  //go the backend.
  const handleSearch = useCallback(
    debounce((searchValue) => {
      getProfiles(searchValue);
    }, 1000),
    [], //Add dependency, when this function should create again.
  );

  const handleClick = () => {
    setSearchResult(true);
  };

  const toggle = () => {
    setShowNetworks(!showNetwork);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.searchBarWithIcon}>
        <MainLogo />
        <ControlledInput
          customClass={styles.searchBar}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            handleSearch.cancel();
            if (e.target.value !== "") {
              handleSearch(e.target.value);
            }
          }}
          onClick={handleClick}
          placeholder="Search"
        />
      </div>
      {searchResult && (
        <div className={styles.allUserProfiles}>
          <Xmark
            onClick={() => setSearchResult(false)}
            styles={{ zIndex: "100" }}
          />
          {userProfiles?.map((profile) => (
            <UserInfo
              url={profile.profileImage.url}
              profileId={profile._id}
              username={profile.name}
              headline={profile.headline}
            />
          ))}
        </div>
      )}

      <div className={styles.navLinks}>
        <Link to={"/home"}>
          <HomeIcon />
          <span>Home</span>
        </Link>
        <div ref={ref}>
          <Link onClick={() => setIsComponentVisible(!isComponentVisible)}>
            <UsersIcon />
            <span>My Network</span>
          </Link>
          {isComponentVisible && (
            <div className={styles.myNetwork}>
              <div className={styles.myNetworkHeader}>Manage your network</div>
              <div className={styles.myNetworkBody}></div>
              <div
                className={styles.myNetworkBodyItem}
                onClick={() => navigate("/network/connections")}
              >
                <UsersIcon /> Connections
              </div>
              <div
                className={styles.myNetworkBodyItem}
                onClick={() => navigate("/network/followers")}
              >
                <UserIcon /> Followers
              </div>
              <div
                className={styles.myNetworkBodyItem}
                onClick={() => navigate("/network/following")}
              >
                <UserIcon />
                Following
              </div>
            </div>
          )}
        </div>

        <Link to={"/jobs"}>
          <JobIcon />
          <span>Jobs</span>
        </Link>
        <Link onClick={() => showMessaging()}>
          <MsgIcon />
          <span>Messaging</span>
        </Link>
        <Link to={"/notifications"}>
          <NotiIcon />
          <span style={{ position: "relative" }}>
            Notifications
            {notiCount > 0 ? (
              <div className={styles.bellIconBadge}>
                <div>{notiCount}</div>
              </div>
            ) : null}
          </span>
        </Link>
        <Link to={`/profile/${currUserProfileId}`}>
          <div className={styles.profileLink}>
            <UserAvatar
              customStyles={{ height: "1.6rem", width: "1.6rem" }}
              url="src/assets/img1.jpg"
            />
            <div>Me</div>
          </div>
        </Link>
      </div>

      <Button
        btnText="Logout"
        onClick={() => logout(currUserId, navigate)}
      ></Button>
    </div>
  );
}
