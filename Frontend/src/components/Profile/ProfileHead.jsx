import "./ProfileHead.css";
import useUserStore from "../../stores/User";
import Button from "../Button.";
import PDF from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useProfileStore from "../../stores/Profile";
import Modal from "../Modal";
import ProfileHeadForm from "./ProfileHeadForm";
import Pen from "../../icons/Pen";
import Xmark from "../../icons/Xmark";
import useFollowStore from "../../stores/Follow";
import useConnectionStore from "../../stores/Connection";
import useChatStore from "../../stores/Chat";
import { useState, useEffect } from "react";

export default function ProfileHead({ profile, styles, createProfile }) {
  const [isFollowed, setisFollowed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);
  const editHead = useProfileStore((state) => state.editHead);
  const setEditHead = useProfileStore((state) => state.setEditHead);
  const handleMessage = useChatStore((state) => state.handleMessage);
  const allFollowed = useUserStore((state) => state.allFollowed);
  const allConnections = useUserStore((state) => state.allConnections);
  const sendConnReq = useConnectionStore((state) => state.sendConnReq);
  const removeConn = useConnectionStore((state) => state.removeConn);

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
    if (allFollowed.has(profile.userId)) {
      setisFollowed(true);
    } else {
      setisFollowed(false);
    }

    if (allConnections.has([profile.userId, currUserId].sort().join("-"))) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [profile.userId, allFollowed, allConnections]);
  return (
    <div className="profileHead">
      <div className="banner">
        <img src={profile?.bannerImage?.url} alt="" />
      </div>
      <div className="profilePic">
        <img src={profile?.profileImage?.url} alt="" />
      </div>
      <div className="text">
        {profile.userId === currUserId && (
          <Pen style={styles} onClick={() => setEditHead(true)} />
        )}
        <div className="details">
          <div className="name">{profile?.name}</div>
          <div>{profile?.headline}</div>
          <div>{profile?.location}</div>
          <div className="contactInfo">
            <span>{profile?.contactInfo?.email}</span>
            <span>{profile?.contactInfo?.phone}</span>
          </div>
          <div className="socials">
            <span>{profile?.followerCount} followers</span>  
            <span>{profile?.connCount} connections</span>
          </div>
        </div>
      </div>
      <div className="allOptions">
        {currUserId !== profile?.userId && (
          <>
            {isFollowed ? (
              <Button
                btnText="Following"
                onClick={() => {
                  unfollow(profile.userId, updateIsFollowed);
                }}
              />
            ) : (
              <Button
                btnText="Follow"
                onClick={() => {
                  follow(profile.userId, updateIsFollowed);
                }}
              />
            )}
            <Button
              btnText="Message"
              onClick={() => handleMessage(profile.userId)}
            />
            {isConnected ? (
              <Button
                btnText="Remove Connection"
                onClick={() => removeConn(profile.userId)}
              />
            ) : (
              <Button
                btnText="Connect"
                onClick={() => sendConnReq(profile.userId)}
              />
            )}
          </>
        )}
        <button className="downloadPdf">
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
          <Xmark style={styles} onClick={() => setEditHead(false)} />
          <ProfileHeadForm
            profile={profile}
            createProfile={createProfile}
            currUserId={currUserId}
          />
        </Modal>
      )}
    </div>
  );
}
