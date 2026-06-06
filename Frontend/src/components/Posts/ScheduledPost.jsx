import styles from "./ScheduledPostsUI.module.css";
import { useState, lazy, Suspense } from "react";
import usePostStore from "../../stores/Post";
import Modal from "../shared-components/Modal/Modal";
import Xmark from "../shared-components/Icons/Xmark";
import Spinner from "../shared-components/Loaders/Spinner";
import { formatTime, formatDate2 } from "../../utils/helper";
import Options from "../shared-components/Options/Options";
import DeleteModal from "../shared-components/Modal/DeleteModal";
import PostForm from "./PostForm";
import useComponentVisible from "../../hooks/useComponentVisible";

export default function ScheduledPost({ scheduledPost }) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const handleDelete = () => deletePost(scheduledPost._id);
  return (
    <div className={styles.scheduledPost}>
      <div className={styles.scheduledPostHead}>
        <div>{`${formatDate2(scheduledPost?.scheduledTime)} at ${formatTime(
          scheduledPost?.scheduledTime,
        )}`}</div>
        <div>
          <Options
            show={isComponentVisible}
            setShow={setIsComponentVisible}
            setEdit={setEditModal}
            setDelete={setDeleteModal}
            dropdownRef={ref}
          />
        </div>
      </div>
      <div>{scheduledPost?.content.substring(0, 50)}...</div>

      {editModal && (
        <Modal>
          <Xmark onClick={() => setEditModal(false)} />
          <Suspense fallback={<Spinner height={40} width={40} />}>
            <PostForm
              mode="edit"
              post={scheduledPost}
              setEditModal={setEditModal}
            />
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
