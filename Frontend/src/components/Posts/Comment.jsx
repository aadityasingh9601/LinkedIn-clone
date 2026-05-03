import Button from "../shared-components/Buttons/Button";
import "./Comment.css";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Modal from "../shared-components/Modal/Modal";
import useUserStore from "../../stores/User";
import Xmark from "../shared-components/Icons/Xmark";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import useCommentStore from "../../stores/Comment";
import PostHead from "../Posts/PostHead";
const ControlledTextarea = lazy(
  () => import("../shared-components/Textarea/ControlledTextarea"),
);

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
            <Suspense fallback={<div>Loading...</div>}>
              <ControlledTextarea
                placeholder="Enter your comment"
                value={newComm}
                onChange={handleChange}
              />
            </Suspense>
            <Button btnText="Cancel" onClick={() => setCommentEdit(false)} />
            <Button
              btnText="Save Changes"
              onClick={() =>
                editComment(
                  comment.postId,
                  comment._id,
                  newComm,
                  updateCommentEdit,
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
