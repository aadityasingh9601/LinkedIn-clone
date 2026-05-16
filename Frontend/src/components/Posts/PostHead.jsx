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
  const currUserId = useUserStore((state) => state.currUserId);
  const allFollowed = useUserStore((state) => state.allFollowed);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

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

      {/* Fix this code later, to transfer it into Options.jsx componenent & use it here. */}
      {/* {currUserId === profileUserId && (
        <button
          className="options"
          onClick={() => setShowOptions(!showOptions)}
        >
          <Ellipsis />
        </button>
      )}
      {showOptions && (
        <div className="options-box">
          {(type === "post" || type == "comment") && (
            <button
              onClick={() => {
                {
                  type === "comment"
                    ? setCommentEdit(true)
                    : seteditModal(true);
                  setShowOptions(false);
                }
              }}
            >
              <Pen />
              Edit
            </button>
          )}
          <button
            onClick={() => {
              setdeleteModal(true);
              setShowOptions(false);
            }}
          >
            <Trash />
            Delete
          </button>
        </div>
      )} */}

      <div className={styles.ellipsis}>{currUserId === profileUserId && (
        <Options show={showOptions} setShow={setShowOptions} setEdit={setEdit} setDelete={setDelete}/>
      )}</div>


    </div>
  );
}
