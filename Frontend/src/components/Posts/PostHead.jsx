import styles from "./PostHead.module.css";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import UserInfo from "../shared-components/User/UserInfo";
import { useEffect, useState, lazy, Suspense } from "react";
import useUserStore from "../../stores/User";
import usePostStore from "../../stores/Post";
import useCommentStore from "../../stores/Comment";
import usePollStore from "../../stores/Poll";
import Ellipsis from "../shared-components/Icons/Ellipsis";
import Plus from "../shared-components/Icons/Plus";
import Check from "../shared-components/Icons/Check";
import useFollowStore from "../../stores/Follow";
import Options from "../shared-components/Options/Options";

export default function PostHead({ data, type, setEdit, setDelete }) {
  const [deleteModal, setdeleteModal] = useState(false);
  
  const [isFollowed, setIsFollowed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  
  const deletePoll = usePollStore((state) => state.deletePoll);
  const { currUserId, allFollowed } = useUserStore((s) => ({
    currUserId: s.currUserId,
    allFollowed: s.allFollowed,
  }));
  const { follow, unfollow } = useFollowStore((s) => ({
    follow: s.follow,
    unfollow: s.unfollow,
  }));

  const profile = data.author?.profile;
  const profileUserId = data.author?._id;

  //To ensure that we can't scroll the page while the modal is open.
  // if (deleteModal || editModal) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "unset";
  // }

  const setFollower = (userId) => {
    follow(userId);
    setIsFollowed(true);
  };

  const unsetFollower = (userId) => {
    unfollow(userId);
    setIsFollowed(false);
  };

  useEffect(() => {
    if (allFollowed.has(profileUserId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [allFollowed]);
  return (
    <div className={styles.postHead}>
      <UserInfo
        url={profile?.profileImage?.url}
        userId={profileUserId}
        username={profile?.name}
        headline={profile?.headline}
        avatarStyles={{height:"3.3rem",width:"3.3rem"}}
      />
      <TimePassed
        timePassed={data?.createdAt}
        styles={{ left: "4.5rem", top: "2.7rem", fontSize: "0.72rem" }}
      />

      {(type === "post" || type === "poll") &&
        currUserId !== profileUserId &&
        (isFollowed ? (
          <button
            className={styles.followedBtn}
            onClick={() => unsetFollower(profileUserId)}
          >
            Following
            <Check styles={{ marginLeft: "0.4rem" }} />
          </button>
        ) : (
          <button
            className={styles.followBtn}
            onClick={() => setFollower(profileUserId)}
          >
            <Plus />
            Follow
          </button>
        ))}

      <div className={styles.ellipsis}>{currUserId === profileUserId && (
        <Options show={showOptions} setShow={setShowOptions} setEdit={setEdit} setDelete={setDelete}/>
      )}</div>


    </div>
  );
}
