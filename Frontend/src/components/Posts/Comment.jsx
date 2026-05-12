import Button from "../shared-components/Buttons/Button";
import styles from "./Comment.module.css";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Modal from "../shared-components/Modal/Modal";
import useUserStore from "../../stores/User";
import Xmark from "../shared-components/Icons/Xmark";
import TimePassed from "../shared-components/Date_Time/TimePassed";
import useCommentStore from "../../stores/Comment";
import PostHead from "../Posts/PostHead";
import DeleteModal from "../shared-components/Modal/DeleteModal";
const ControlledTextarea = lazy(
  () => import("../shared-components/Textarea/ControlledTextarea"),
);

export default function Comment({ comment }) {
  console.log(comment?.author._id, comment?._id);
  const [toggle, setToggle] = useState(false);
  const [newComm, setnewComm] = useState(comment.text);
  const [commentEdit, setCommentEdit] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const editComment = useCommentStore((state) => state.editComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const handleDelete = () =>{
    deleteComment(comment?.author._id, comment?._id)
  }

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
                        setCommentEdit,
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
          <DeleteModal
            handleCancel={setdeleteModal}
            handleDelete={handleDelete}
          />
        </Modal>
      )}
    </>
  );
}
