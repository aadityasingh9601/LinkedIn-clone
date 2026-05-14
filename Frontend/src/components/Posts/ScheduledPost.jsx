import styles from "./ScheduledPostsUI.module.css";
import { useState, lazy, Suspense } from "react";
import Button from "../shared-components/Buttons/Button";
import usePostStore from "../../stores/Post";
import Modal from "../shared-components/Modal/Modal";
import Ellipsis from "../shared-components/Icons/Ellipsis";
import Xmark from "../shared-components/Icons/Xmark";
import { formatTime, formatDate2 } from "../../utils/helper";
import Options from "../shared-components/Options/Options";
import DeleteModal from "../shared-components/Modal/DeleteModal";

const PostEditForm = lazy(() => import("./PostEditForm"));

export default function ScheduledPost({ scheduledPost }) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const [options, setOptions] = useState(false);
  const handleDelete = () => deletePost(scheduledPost._id);
  return (
    <div className={styles.scheduledPost}>
      <div className={styles.scheduledPostHead}>
        <div>{`${formatDate2(scheduledPost?.scheduledTime)} at ${formatTime(
          scheduledPost?.scheduledTime,
        )}`}</div>
        <div>
          <Options
            show={options}
            setShow={setOptions}
            setEdit={setEditModal}
            setDelete={setDeleteModal}
          />
        </div>
      </div>
      <div>{scheduledPost?.content.substring(0, 50)}...</div>

      {editModal && (
        <Modal>
          <Xmark onClick={() => setEditModal(false)} />
          <Suspense fallback={<div>Loading...</div>}>
            <PostEditForm post={scheduledPost} />
          </Suspense>
        </Modal>
      )}

      {deleteModal && (
        <DeleteModal
          handleCancel={setDeleteModal}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
