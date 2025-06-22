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

export default function ProfileHead({
  profile,
  styles,
  isFollowed,
  isConnected,
  createProfile,
}) {
  const currUserId = useUserStore((state) => state.currUserId);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);
  const editHead = useProfileStore((state) => state.editHead);
  const setEditHead = useProfileStore((state) => state.setEditHead);
  const handleMessage = useChatStore((state) => state.handleMessage);
  const sendConnReq = useConnectionStore((state) => state.sendConnReq);

  //To ensure that we can't scroll the page while the modal is open.
  if (editHead) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  return (
    <div className="profileHead">
      <div className="banner">
        <img src={profile.bannerImage?.url} alt="" />
      </div>
      <div className="profilePic">
        <img src={profile.profileImage?.url} alt="" />
      </div>
      <div className="text">
        <Pen style={styles} onClick={() => setEditHead(true)} />

        <h2>{profile.name}</h2>
        <p>{profile.headline}</p>
        <p>
          {profile.location}
          <a href="#">
            <span>{profile.contactInfo?.email}</span>
            <span>{profile.contactInfo?.phone}</span>
          </a>
        </p>
        <span
          style={{
            margin: "0 0.7rem 0 0",
            color: "rgba(135, 130, 130)",
            fontSize: "0.9rem",
          }}
        >
          {profile.followerCount} followers
        </span>
        <span
          style={{
            margin: "0 0.7rem 0 0",
            color: "rgba(135, 130, 130)",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {profile.connCount} connections
        </span>
      </div>
      <div className="allOptions">
        {currUserId !== profile.userId && (
          <>
            {isFollowed ? (
              <Button
                btnText=" Following "
                onClick={() => unfollow(profile.userId)}
              />
            ) : (
              <Button btnText="Follow" onClick={() => follow(profile.userId)} />
            )}
            <Button
              btnText="Message"
              onClick={() => handleMessage(profile.userId)}
            />
            {!isConnected && (
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
          <ProfileHeadForm profile={profile} createProfile={createProfile} />
        </Modal>
      )}
    </div>
  );
}
