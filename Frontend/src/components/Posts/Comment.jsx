import Button from "../Button.";
import "./Comment.css";
import { useState, useEffect, useCallback } from "react";
import Modal from "../Modal";
import useUserStore from "../../stores/User";
import Xmark from "../../icons/Xmark";
import ControlledTextarea from "../ControlledTextarea";
import TimePassed from "../TimePassed";
import useCommentStore from "../../stores/Comment";
import PostHead from "./PostHead";

export default function Comment({ comment }) {
  const [toggle, setToggle] = useState(false);

  const [newComm, setnewComm] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const editComment = useCommentStore((state) => state.editComment);

  const handleChange = (e) => {
    setnewComm(e.target.value);
  };

  const updateCommentEdit = (value) => {
    setCommentEdit(value);
  };

  return (
    <div className="comment">
      <PostHead
        data={comment}
        type="comment"
        setCommentEdit={updateCommentEdit}
      />
      <div className="txt">
        {commentEdit ? (
          <>
            <ControlledTextarea
              placeholder="Enter your comment"
              value={newComm}
              onChange={handleChange}
            />
            <Button btnText="Cancel" onClick={() => setCommentEdit(false)} />
            <Button
              btnText="Save Changes"
              onClick={() =>
                editComment(
                  comment.postId,
                  comment._id,
                  newComm,
                  updateCommentEdit
                )
              }
            />
          </>
        ) : (
          comment.text
        )}
      </div>
    </div>
  );
}
