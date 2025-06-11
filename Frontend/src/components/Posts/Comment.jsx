import Button from "../Button.";
import "./Comment.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "../Modal";
import useUserStore from "../../stores/User";
import { timeRep } from "../../utils/helper";
import Trash from "../../icons/Trash";
import User from "../User";
import Ellipsis from "../../icons/Ellipsis";
import Pen from "../../icons/Pen";
import Xmark from "../../icons/Xmark";
import ControlledTextarea from "../ControlledTextarea";

export default function Comment({ comment, updateComments }) {
  const [toggle, setToggle] = useState(false);
  const [commentText, setcommentText] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const newAccessToken = useUserStore((state) => state.newAccessToken);
  const currUserId = useUserStore((state) => state.currUserId);

  const { days, hours, minutes, seconds } = timeRep(
    new Date() - new Date(comment.createdAt)
  );

  const showOptions = (value) => {
    setToggle(value);
  };

  const handleChange = (e) => {
    setcommentText(e.target.value);
  };

  const editComment = async (commentId) => {
    //Update comment in database.
    try {
      const response = await axios.patch(
        `http://localhost:8000/post/${comment.postId}/comment/${commentId}`,
        { commentText },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setcommentText(response.data.message);
        setCommentEdit(false);
        return toast.success("Comment updated!");
      }
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/post/${comment.postId}/comment/${commentId}`,
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        //Updating the state.
        updateComments(commentId);
        setdeleteModal(false);
        return toast.success("Comment deleted!");
      }
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  };

  return (
    <div className="comment">
      <div className="header">
        <User
          url={comment.author.profile.profileImage.url}
          username={comment.author.profile.name}
          userId={comment.author.profile.userId}
          headline={comment.author.profile.headline}
        />
        <span
          style={{
            position: "absolute",
            left: "4.5rem",
            top: "2.9rem",
            fontSize: "0.66rem",
            color: "rgba(0,0,0,0.65)",
          }}
        >
          {days > 0
            ? `${days}d `
            : hours > 0
            ? `${hours}h `
            : minutes > 0
            ? `${minutes}m`
            : `${seconds}s`}
        </span>

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
              onClick={() => editComment(comment._id)}
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
          <Button btnText="Delete" onClick={() => deleteComment(comment._id)} />
          <Button btnText="Cancel" onClick={() => setdeleteModal(false)} />
        </Modal>
      )}
    </div>
  );
}
