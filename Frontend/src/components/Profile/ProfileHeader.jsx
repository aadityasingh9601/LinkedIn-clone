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
  const currUserId = useUserStore((s) => s.currUserId);
  const allFollowed = useUserStore((s) => s.allFollowed);
  const allConnections = useUserStore((s) => s.allConnections);
  const currUserProfile = useUserStore((s) => s.currUserProfile);
  const follow = useFollowStore((s) => s.follow);
  const unfollow = useFollowStore((s) => s.unfollow);
  const editHead = useProfileStore((s) => s.editHead);
  const setEditHead = useProfileStore((s) => s.setEditHead);
  const createChat = useChatStore((s) => s.createChat);
  const handleMessage = useChatStore((s) => s.handleMessage);
  const setfullChat = useChatStore((s) => s.setfullChat);
  const sendConnReq = useConnectionStore((s) => s.sendConnReq);
  const removeConn = useConnectionStore((s) => s.removeConn);

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
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileHeaderForm profile={profile} handleCancel={()=> setEditHead(false)}/>
          </Suspense>
        </Modal>
      )}
    </div>
  );
}
