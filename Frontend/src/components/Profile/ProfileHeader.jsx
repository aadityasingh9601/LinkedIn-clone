import styles from "./ProfileHeader.module.css";
import useUserStore from "../../stores/User";
import Button from "../shared-components/Buttons/Button";
import PDF from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useProfileStore from "../../stores/Profile";
import Modal from "../shared-components/Modal/Modal";
import { lazy, Suspense } from "react";
import Pen from "../shared-components/Icons/Pen";
import Xmark from "../shared-components/Icons/Xmark";
import useFollowStore from "../../stores/Follow";
import useConnectionStore from "../../stores/Connection";
import useChatStore from "../../stores/Chat";
import { useState, useEffect } from "react";
import ProfileHeaderForm from "./ProfileHeaderForm";

export default function ProfileHeader({ customStyles, profile }) {
  const [isFollowed, setisFollowed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { currUserId, allFollowed, allConnections, currUserProfile } = useUserStore((s) => ({
    currUserId: s.currUserId,
    allFollowed: s.allFollowed,
    allConnections: s.allConnections,
    currUserProfile: s.currUserProfile,
  }));
  const { follow, unfollow } = useFollowStore((s) => ({
    follow: s.follow,
    unfollow: s.unfollow,
  }));
  const { editHead, setEditHead } = useProfileStore((s) => ({
    editHead: s.editHead,
    setEditHead: s.setEditHead,
  }));
  const { createChat, handleMessage, setfullChat } = useChatStore((s) => ({
    createChat: s.createChat,
    handleMessage: s.handleMessage,
    setfullChat: s.setfullChat,
  }));
  const { sendConnReq, removeConn } = useConnectionStore((s) => ({
    sendConnReq: s.sendConnReq,
    removeConn: s.removeConn,
  }));

  const existingChat = () => {
    for (let chat of currUserProfile?.chatList) {
      console.log(chat);
      let success = [currUserId, profile?.userId].every((val) =>
        chat.participants.includes(val),
      );
      if (success) return chat;
    }
    return {};
  };

  console.log(allFollowed);
  console.log(allConnections);

  const updateIsFollowed = (value) => {
    setisFollowed(value);
  };
  //To ensure that we can't scroll the page while the modal is open.
  if (editHead) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  useEffect(() => {
    if (allFollowed.has(profile?.userId)) {
      setisFollowed(true);
    } else {
      setisFollowed(false);
    }

    if (allConnections.has([profile?.userId, currUserId].sort().join("-"))) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [profile?.userId, allFollowed, allConnections]);
  return (
    <div className={styles.profileHeader}>
      <div className={styles.banner}>
        <img src={profile?.bannerImage?.url} alt="" />
      </div>
      <div className={styles.profilePic}>
        <img src={profile?.profileImage?.url} alt="" />
      </div>
      <div className={styles.text}>
        {profile?.userId === currUserId && (
          <Pen onClick={() => setEditHead(true)} />
        )}
        <div className={styles.details}>
          <div className={styles.name}>{profile?.name}</div>
          <div>{profile?.headline}</div>
          <div>{profile?.location}</div>
          <div className={styles.contactInfo}>
            <div>{profile?.contactInfo?.email}</div>
            {profile?.contactInfo?.phone && (
              <div>{profile?.contactInfo?.phone}</div>
            )}
          </div>
          <div className={styles.socials}>
            <span>{profile?.followerCount} followers</span>
            <span>{profile?.connCount} connections</span>
          </div>
        </div>
      </div>
      <div className={styles.allOptions}>
        {currUserId !== profile?.userId && (
          <>
            {isFollowed ? (
              <Button
                variant="sm"
                btnText="Following"
                onClick={() => {
                  unfollow(profile?.userId, updateIsFollowed);
                }}
              />
            ) : (
              <Button
                variant="sm"
                btnText="Follow"
                onClick={() => {
                  follow(profile?.userId, updateIsFollowed);
                }}
              />
            )}
            <Button
              variant="sm"
              btnText="Message"
              onClick={() => {
                let result = existingChat();
                setfullChat(true);
                if (Object.keys(result).length === 0) {
                }
              }}
            />
            {isConnected ? (
              <Button
                variant="sm"
                btnText="Remove Connection"
                onClick={() => removeConn(profile?.userId)}
              />
            ) : (
              <Button
                variant="sm"
                btnText="Connect"
                onClick={() => sendConnReq(profile?.userId)}
              />
            )}
          </>
        )}
        <button className={styles.downloadPdf}>
          <PDFDownloadLink
            document={<PDF user={profile} />}
            fileName="Profile.pdf"
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </button>
      </div>
      {editHead && (
        <Modal>
          <Xmark onClick={() => setEditHead(false)} />
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileHeaderForm profile={profile} />
          </Suspense>
        </Modal>
      )}
    </div>
  );
}
