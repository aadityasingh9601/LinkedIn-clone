import styles from "./Post.module.css";
import { lazy } from "react";
import { useState, useEffect, useRef } from "react";
import usePostStore from "../../stores/Post";
import Modal from "../shared-components/Modal/Modal";
import { Suspense } from "react";
const CommentSection = lazy(() => import("./CommentSection"));
import useUserStore from "../../stores/User";
import UserInfo from "../shared-components/User/UserInfo";
import Xmark from "../shared-components/Icons/Xmark";
import ThumbsupR from "../shared-components/Icons/ThumbsupR";
import ThumbsupS from "../shared-components/Icons/ThumbsupS";
import PaperPlane from "../shared-components/Icons/PaperPlane";
import CommentR from "../shared-components/Icons/CommentR";
import useCommentStore from "../../stores/Comment";
import PostHead from "../Posts/PostHead";
import DeleteModal from "../shared-components/Modal/DeleteModal";
import PostForm from "./PostForm";

export default function Post({ post, postRef }) {
  const allLikedPosts = useUserStore((s) => s.allLikedPosts);
  const getAllLikes = usePostStore((s) => s.getAllLikes);
  const usersWhoLiked = usePostStore((s) => s.usersWhoLiked);
  const [showComments, setshowComments] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [likeModal, setlikeModal] = useState(false);
  const [isLiked, setisLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const deletePost = usePostStore((s) => s.deletePost);
  const likePost = usePostStore((s) => s.likePost);
  const unlikePost = usePostStore((s) => s.unlikePost);
  const [commentCount, setCommentCount] = useState(post.comments.length);

  const comments = useCommentStore((state) => state.comments);

  const [editModal, setEditModal] = useState(false);

  const toggleEditModal = (value) => {
    setEditModal(value);
  };

  const togglelikeModal = (value) => {
    setlikeModal(value);
  };

  const setLike = () => {
    likePost(post._id);
    setisLiked(true);
    setLikeCount(likeCount + 1);
  };

  const unsetLike = () => {
    unlikePost(post._id);
    setisLiked(false);
    setLikeCount(likeCount - 1);
  };

  useEffect(() => {
    if (allLikedPosts.has(post._id)) {
      setisLiked(true);
    } else {
      setisLiked(false);
    }
  }, [allLikedPosts]);

  //Fetch likes related to a post when like modal shows up.
  useEffect(() => {
    if (likeModal) {
      getAllLikes(post?._id);
    }
  }, [likeModal]);

  return (
    <>
      <div className={styles.post} data-post-id={post?._id} ref={postRef}>
        <PostHead
          data={post}
          type="post"
          setEdit={setEditModal}
          setDelete={setdeleteModal}
        />
        <div className={styles.body}>
          <div className={styles["body-text"]}>{post?.content}</div>
          <div className={styles.media}>
            {post?.media?.mediaType === "image" ? (
              <img src={post?.media?.url} alt="" />
            ) : post?.media?.mediaType === "video" ? (
              <video controls>
                <source src={post?.media?.url} type="video/mp4" />
              </video>
            ) : null}
          </div>
          <div className={styles.postInfo}>
            <div>
              <span onClick={() => togglelikeModal(true)}>
                {likeCount} likes
              </span>
              {", "}
              <span onClick={() => setshowComments(!showComments)}>
                {commentCount} comments
              </span>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button onClick={isLiked ? unsetLike : setLike}>
            {isLiked ? (
              <ThumbsupS styles={{ color: "#0a66c2" }} />
            ) : (
              <ThumbsupR />
            )}
            Like
          </button>
          <button onClick={() => setshowComments(!showComments)}>
            <CommentR />
            Comment
          </button>
          {/* Add functionality to this button so that on clicking send URL of the post is copied, so that can be sent to anyone
        and they can access the post */}
          <button>
            <PaperPlane />
            Send
          </button>
        </div>

        {showComments && (
          <CommentSection
            postId={post._id}
            comments={comments}
            showComments={showComments}
            setshowComments={setshowComments}
          />
        )}

        {likeModal && (
          <Modal>
            <div className={styles.likeList}>
              <div className={styles.likeListHeader}>
                Likes <Xmark onClick={() => togglelikeModal(false)} />
              </div>
              <div className={styles.likeListBody}>
                {usersWhoLiked?.map((like) => {
                  return (
                    <UserInfo
                      customClass={styles.likeListUser}
                      profileId={like?.user.profile._id}
                      url={like?.user.profile.profileImage.url}
                      username={like?.user.profile.name}
                      headline={like?.user.profile.headline}
                      avatarStyles={{ height: "3.1rem", width: "3.1rem" }}
                    />
                  );
                })}
              </div>
            </div>
          </Modal>
        )}
      </div>
      {editModal && (
        <Modal>
          <Xmark onClick={() => toggleEditModal(false)} />
          <Suspense fallback={<div>Loading...</div>}>
            <PostForm mode="edit" post={post} setEditModal={setEditModal} />
            {/* <PostEditForm post={post} toggleEditModal={toggleEditModal} /> */}
          </Suspense>
        </Modal>
      )}

      {deleteModal && (
        <Modal>
          <DeleteModal
            handleCancel={setdeleteModal}
            handleDelete={() => {
              deletePost(post._id);
            }}
          />
        </Modal>
      )}
    </>
  );
}
