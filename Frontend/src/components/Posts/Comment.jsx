import Button from "../Button.";
import "./Comment.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "../Modal";
import useUserStore from "../../stores/User";
import Trash from "../../icons/Trash";
import User from "../User";
import Ellipsis from "../../icons/Ellipsis";
import Pen from "../../icons/Pen";
import Xmark from "../../icons/Xmark";
import ControlledTextarea from "../ControlledTextarea";
import TimePassed from "../TimePassed";
import useCommentStore from "../../stores/Comment";

export default function Comment({ comment }) {
  const [toggle, setToggle] = useState(false);
  const [commentText, setcommentText] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const newAccessToken = useUserStore((state) => state.newAccessToken);
  const currUserId = useUserStore((state) => state.currUserId);
  const editComment = useCommentStore((state) => state.editComment);

  const showOptions = (value) => {
    setToggle(value);
  };

  const handleChange = (e) => {
    setcommentText(e.target.value);
  };

  useEffect(() => {
    if (showComments) {
      getAllComments();
    }
  }, [showComments]);

  return (
    <div className="comment">
      <div className="header">
        <User
          url={comment.author.profile.profileImage.url}
          username={comment.author.profile.name}
          userId={comment.author.profile.userId}
          headline={comment.author.profile.headline}
        />
        <TimePassed timePassed={comment.createdAt} />

        {currUserId === comment.author._id && (
          <button className="options" onClick={() => showOptions(!toggle)}>
            <Ellipsis />
          </button>
        )}
        {toggle ? (
          <div className="options-box">
            <button
              onClick={() => {
                setCommentEdit(true), showOptions(false);
              }}
            >
              <Pen />
              Edit
            </button>
            <button
              onClick={() => {
                setdeleteModal(true), showOptions(false);
              }}
            >
              <Trash /> Delete
            </button>
          </div>
        ) : null}
      </div>

      <div className="txt">
        {commentEdit ? (
          <>
            <ControlledTextarea
              placeholder="Enter your comment"
              value={commentText}
              onChange={handleChange}
            />

            <Button
              btnText="Save Changes"
              onClick={() => editComment(comment.postId, comment._id)}
            />
          </>
        ) : (
          commentText
        )}
      </div>
      {deleteModal && (
        <Modal>
          <Xmark onClick={() => setdeleteModal(false)} />

          <p style={{ margin: "1rem 0 1rem 0 " }}>
            <b>Are you sure you want to delete this comment?</b>
            <br></br>
            Deleted comment can't be retrieved once they are deleted!!
          </p>
          <Button
            btnText="Delete"
            onClick={() => deleteComment(comment.postId, comment._id)}
          />
          <Button btnText="Cancel" onClick={() => setdeleteModal(false)} />
        </Modal>
      )}
    </div>
  );
}
