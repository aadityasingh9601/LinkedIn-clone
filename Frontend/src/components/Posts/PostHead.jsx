import styles from "./PostHead.module.css";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import UserInfo from "../shared-components/User/UserInfo";
import { useEffect, useState, lazy, Suspense } from "react";
import useUserStore from "../../stores/User";
import usePollStore from "../../stores/Poll";
import Plus from "../shared-components/Icons/Plus";
import Check from "../shared-components/Icons/Check";
import useFollowStore from "../../stores/Follow";
import Options from "../shared-components/Options/Options";
import useComponentVisible from "../../hooks/useComponentVisible";

export default function PostHead({ data, type, setEdit, setDelete }) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const [isFollowed, setIsFollowed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const currUserId = useUserStore((s) => s.currUserId);
  const allFollowed = useUserStore((s) => s.allFollowed);
  const follow = useFollowStore((s) => s.follow);
  const unfollow = useFollowStore((s) => s.unfollow);
  const profile = data.author?.profile;
  const profileUserId = data.author?._id;

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
        avatarStyles={{ height: "3.3rem", width: "3.3rem" }}
      />
      <TimePassed
        timePassed={data?.createdAt}
        styles={{ left: "4.5rem", top: "2.7rem", fontSize: "0.72rem" }}
      />

      {(type === "post" || type === "poll") && currUserId !== profileUserId && (
        <div className={styles.followBtnWrapper}>
          {isFollowed ? (
            <button
              className={styles.followedBtn}
              onClick={() => unsetFollower(profileUserId)}
            >
              Following
              <Check />
            </button>
          ) : (
            <button
              className={styles.followBtn}
              onClick={() => setFollower(profileUserId)}
            >
              <Plus />
              Follow
            </button>
          )}
        </div>
      )}

      <div className={styles.ellipsis}>
        {currUserId === profileUserId && (
          <Options
            show={isComponentVisible}
            setShow={setIsComponentVisible}
            setEdit={setEdit}
            setDelete={setDelete}
            dropdownRef={ref}
          />
        )}
      </div>
    </div>
  );
}
