import "./ProfileHead.css";
import useUserStore from "../../stores/User";
import Button from "../Button.";
import PDF from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useProfileStore from "../../stores/Profile";
import Modal from "../Modal";
import ProfileHeadForm from "./ProfileHeadForm";

export default function ProfileHead({
  profile,
  styles,
  isFollowed,
  isConnected,
  createProfile,
}) {
  const currUserId = useUserStore((state) => state.currUserId);

  const editHead = useProfileStore((state) => state.editHead);
  const setEditHead = useProfileStore((state) => state.setEditHead);

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
        <i
          class="fa-solid fa-pen"
          style={styles}
          onClick={() => setEditHead(true)}
        ></i>
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
                onClick={() => unfollow(currProfileId)}
              />
            ) : (
              <Button btnText="Follow" onClick={() => follow(currProfileId)} />
            )}
            <Button btnText="Message" onClick={() => handleMessage()} />
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
          <i
            class="fa-solid fa-xmark cross"
            style={styles}
            onClick={() => setEditHead(false)}
          ></i>
          <ProfileHeadForm profile={profile} createProfile={createProfile} />
        </Modal>
      )}
    </div>
  );
}
