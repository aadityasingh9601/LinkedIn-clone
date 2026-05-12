import Button from "../shared-components/Buttons/Button";
import styles from "./Comment.module.css";
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
  console.log(comment)
  const [toggle, setToggle] = useState(false);
  const [newComm, setnewComm] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const editComment = useCommentStore((state) => state.editComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);

  const handleChange = (e) => {
    setnewComm(e.target.value);
  };

  return (
    <>
      <div className={styles.comment}>
        <PostHead
          data={comment}
          type="comment"
          setEdit={setCommentEdit}
          setDelete={setdeleteModal}
        />
        <div className={styles.commentText}>
          {commentEdit ? (
            <>
              <Suspense fallback={<div>Loading...</div>}>
                <ControlledTextarea
                  placeholder="Enter your comment"
                  value={newComm}
                  onChange={handleChange}
                />
                <div className={styles.btns}>
                  <Button
                    btnText="Cancel"
                    variant="sm"
                    onClick={() => setCommentEdit(false)}
                  />
                  <Button
                    btnText="Save Changes"
                    variant="sm"
                    onClick={() =>
                      editComment(
                        comment.postId,
                        comment._id,
                        newComm,
                        updateCommentEdit,
                      )
                    }
                  />
                </div>
              </Suspense>
            </>
          ) : (
            comment.text
          )}
        </div>
      </div>

      {deleteModal && (
        <Modal>
          <Xmark onClick={() => setdeleteModal(false)} />

          <p style={{ margin: "1rem 0 1rem 0 " }}>
            <b>Are you sure you want to delete this?</b>
            <br></br>
            This action isn't reversible!
          </p>
          <Button
            btnText="Delete"
            onClick={() => {
              deleteComment(comment?.author._id,comment?._id);
            }}
          />
          <Button btnText="Cancel" onClick={() => setdeleteModal(false)} />
        </Modal>
      )}
    </>
  );
}
