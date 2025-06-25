import "./PostHead.css";
import TimePassed from "../TimePassed";
import User from "../User";
import { useEffect, useState } from "react";
import useUserStore from "../../stores/User";
import usePostStore from "../../stores/Post";
import useCommentStore from "../../stores/Comment";
import usePollStore from "../../stores/Poll";
import Ellipsis from "../../icons/Ellipsis";
import Plus from "../../icons/Plus";
import Check from "../../icons/Check";
import useFollowStore from "../../stores/Follow";
import Pen from "../../icons/Pen";
import Trash from "../../icons/Trash";
import Modal from "../Modal";
import Xmark from "../../icons/Xmark";
import Button from "../Button.";
import PostEditForm from "./PostEditForm";

export default function PostHead({ data, type, setCommentEdit = () => {} }) {
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [toggle, setToggle] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const deletePoll = usePollStore((state) => state.deletePoll);
  const currUserId = useUserStore((state) => state.currUserId);
  const allFollowed = useUserStore((state) => state.allFollowed);
  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

  const profile =
    type === "comment" ? data.author?.profile : data.createdBy?.profile;

  const profileUserId =
    type === "comment" ? data.author?._id : data.createdBy?._id;

  const toggleEditModal = () => {
    seteditModal(!editModal);
  };

  //To ensure that we can't scroll the page while the modal is open.
  if (deleteModal || editModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

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
    <div className="postHead">
      <User
        url={profile.profileImage.url}
        userId={profileUserId}
        username={profile.name}
        headline={profile.headline}
      />
      <TimePassed
        timePassed={data.createdAt}
        styles={{ left: "4.5rem", top: "2.7rem", fontSize: "0.72rem" }}
      />

      {(type === "post" || type === "poll") &&
        currUserId !== profileUserId &&
        (isFollowed ? (
          <button
            className="followedBtn"
            onClick={() => unsetFollower(profileUserId)}
          >
            Following
            <Check styles={{ marginLeft: "0.4rem" }} />
          </button>
        ) : (
          <button
            className="followBtn"
            onClick={() => setFollower(profileUserId)}
          >
            <Plus />
            Follow
          </button>
        ))}

      {currUserId === profileUserId && (
        <button className="options" onClick={() => setToggle(!toggle)}>
          <Ellipsis />
        </button>
      )}
      {toggle ? (
        <div className="options-box">
          {(type === "post" || type == "comment") && (
            <button
              onClick={() => {
                {
                  type === "comment"
                    ? setCommentEdit(true)
                    : seteditModal(true);
                  setToggle(false);
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
              setToggle(false);
            }}
          >
            <Trash />
            Delete
          </button>
        </div>
      ) : null}

      {editModal && (
        <Modal>
          <Xmark onClick={() => toggleEditModal(false)} />
          <PostEditForm post={data} toggleEditModal={toggleEditModal} />
        </Modal>
      )}

      {deleteModal && (
        <Modal>
          <Xmark onClick={() => setdeleteModal(false)} />

          <p style={{ margin: "1rem 0 1rem 0 " }}>
            <b>Are you sure you want to delete this {type}?</b>
            <br></br>
            Deleted {type}s can't be retrieved once they are deleted!!
          </p>
          <Button
            btnText="Delete"
            onClick={() =>
              type === "post"
                ? deletePost(data._id)
                : type === "comment"
                ? deleteComment(data.postId, data._id)
                : type === "poll"
                ? deletePoll(data._id)
                : null
            }
          />
          <Button btnText="Cancel" onClick={() => setdeleteModal(false)} />
        </Modal>
      )}
    </div>
  );
}
