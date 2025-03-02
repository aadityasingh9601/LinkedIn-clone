import Button from "../Button.";
import "./Comment.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "../Modal";
import useUserStore from "../../stores/User";

export default function Comment({ comment, updateComments }) {
  const [toggle, setToggle] = useState(false);
  const [commentText, setcommentText] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const newAccessToken = useUserStore((state) => state.newAccessToken);
  const userId = localStorage.getItem("userId");

  const currDate = new Date();
  const createdDate = new Date(comment.createdAt); //See the reason and all that date related information in ChatGPT. Take notes.
  const seconds = Math.floor((currDate - createdDate) / 1000); //Converting to seconds
  const minutes = Math.floor(seconds / 60); //Converting to minutes
  const hours = Math.floor(minutes / 60); //Converting to hours
  const days = Math.floor(hours / 24); //Converting to days.

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
        <div className="img">
          <img src={comment.author.profile.profileImage.url} alt="" />
        </div>
        <div className="headline">
          <span>
            <b>{comment.author.profile.name}</b>
          </span>
          <br />
          <span style={{ fontSize: "0.8rem" }}>
            {comment.author.profile.headline}
          </span>
          <br />
          <span style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.65)" }}>
            {days > 0
              ? `${days}d `
              : hours > 0
              ? `${hours}h `
              : minutes > 0
              ? `${minutes}m`
              : `${seconds}s`}
          </span>
        </div>
        {userId === comment.author._id && (
          <button className="options" onClick={() => showOptions(!toggle)}>
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        )}
        {toggle ? (
          <div className="options-box">
            <button
              onClick={() => {
                setCommentEdit(true), showOptions(false);
              }}
            >
              <i class="fa-solid fa-pen"></i>
              Edit
            </button>
            <button
              onClick={() => {
                setdeleteModal(true), showOptions(false);
              }}
            >
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        ) : null}
      </div>

      <div className="txt">
        {commentEdit ? (
          <>
            <textarea value={commentText} onChange={handleChange} />
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
          <i
            class="fa-solid fa-xmark cross"
            onClick={() => setdeleteModal(false)}
          ></i>
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
