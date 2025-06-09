import "./Post.css";
import { lazy } from "react";
import { useState, useEffect, useRef } from "react";
import usePostStore from "../../stores/Post";
import Modal from "../Modal";
const Button = lazy(() => import("../Button."));
const PostEditForm = lazy(() => import("./PostEditForm"));
const CommentSection = lazy(() => import("./CommentSection"));
import axios from "axios";
import { toast } from "react-toastify";
import useComment from "../../hooks/useComment";
import useUserStore from "../../stores/User";
import useFollowStore from "../../stores/Follow";
import { timeRep } from "../../utils/helper";
import Avatar from "../Avatar";
import User from "../User";
import Xmark from "../../icons/Xmark";
import Pen from "../../icons/Pen";
import ThumbsupR from "../../icons/ThumbsupR";
import ThumbsupS from "../../icons/ThumbsupS";
import PaperPlane from "../../icons/PaperPlane";
import CommentR from "../../icons/CommentR";
import Check from "../../icons/Check";
import Ellipsis from "../../icons/Ellipsis";

//The error was occuring because I was accessing props like this,"function Post(post) " and because of that
//the whole props object was getting logged on the console and post.createdBy was printing undefined , while when
//I accessed the props the correct way, i.e. written below, the post prop gets destructed from the complete props
//object and everything started working properly again.

export default function Post({ post, postRef }) {
  console.log("rendered");
  const currUserId = useUserStore((state) => state.currUserId);

  const [isFollowed, setIsFollowed] = useState(false);
  //console.log(post._id);
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [likeModal, setlikeModal] = useState(false);
  const [isLiked, setisLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const follow = useFollowStore((state) => state.follow);
  const unfollow = useFollowStore((state) => state.unfollow);

  const [commentCount, setCommentCount] = useState(post.comments.length);
  const deletePost = usePostStore((state) => state.deletePost);
  const likePost = usePostStore((state) => state.likePost);
  const unlikePost = usePostStore((state) => state.unlikePost);
  const [likedUsers, setlikedUsers] = useState([]);

  const allLikedPosts = useUserStore((state) => state.allLikedPosts);
  const allFollowed = useUserStore((state) => state.allFollowed);

  const { comments, setComments, showComments, setshowComments, addComment } =
    useComment(post._id);

  //To ensure that we can't scroll the page while the modal is open.
  if (deleteModal || likeModal || editModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  const { days, hours, minutes, seconds } = timeRep(
    new Date() - new Date(post.createdAt)
  );

  const toggleEditModal = () => {
    seteditModal(!editModal);
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

  const setFollower = (userId) => {
    follow(userId);
    setIsFollowed(true);
  };

  const unsetFollower = (userId) => {
    unfollow(userId);
    setIsFollowed(false);
  };

  useEffect(() => {
    if (allLikedPosts.has(post._id)) {
      setisLiked(true);
    } else {
      setisLiked(false);
    }

    //Update the state.
    if (allFollowed.has(post.createdBy._id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [allFollowed]);

  //Fetch likes related to a post when like modal shows up.
  useEffect(() => {
    if (likeModal) {
      getAllLikes(post._id);
    }
  }, [likeModal]);

  //Creating function to filter the comments state variable after post delettion.
  const updateComments = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  return (
    <div className="post" data-post-id={post._id} ref={postRef}>
      <div className="header">
        <User
          url={post.createdBy.profile.profileImage.url}
          userId={post.createdBy.profile.userId}
          username={post.createdBy.profile.name}
          headline={post.createdBy.profile.headline}
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

        {currUserId !== post.createdBy._id &&
          (isFollowed ? (
            <button
              className="followedBtn"
              onClick={() => unsetFollower(post.createdBy._id)}
            >
              Following
              <Check styles={{ marginLeft: "0.4rem" }} />
            </button>
          ) : (
            <button
              className="followBtn"
              onClick={() => setFollower(post.createdBy._id)}
            >
              <Plus />
              Follow
            </button>
          ))}

        {currUserId === post.createdBy._id && (
          <button className="options" onClick={() => setToggle(!toggle)}>
            <Ellipsis />
          </button>
        )}
        {toggle ? (
          <div className="options-box">
            <button
              onClick={() => {
                seteditModal(true);
                setToggle(false);
              }}
            >
              <Pen />
              Edit
            </button>
            <button
              onClick={() => {
                setdeleteModal(true);
                setToggle(false);
              }}
            >
              <Trash />
              Delete
            </button>
          </div>
        ) : null}
      </div>
      <div className="body">
        <div className="body-text">{post.content}</div>
        <div className="media">
          {post.media.mediaType === "image" ? (
            <img src={post.media.url} alt="" />
          ) : post.media.mediaType === "video" ? (
            <video controls>
              <source src={post.media.url} type="video/mp4" />
            </video>
          ) : null}
        </div>
        <div className="postInfo">
          <div>
            <span onClick={() => togglelikeModal(true)}>{likeCount} likes</span>
            ,
            <span onClick={() => setshowComments(!showComments)}>
              {commentCount} comments
            </span>
          </div>
        </div>
      </div>
      <div className="footer">
        <button>
          {isLiked ? (
            <ThumbsupS onClick={unsetLike} styles={{ color: "#0a66c2" }} />
          ) : (
            <ThumbsupR onClick={setLike} />
          )}
          Like
        </button>
        <button onClick={() => setshowComments(!showComments)}>
          <CommentR />
          Comment
        </button>
        <button>
          <PaperPlane />
          Send
        </button>
      </div>

      {showComments && (
        <CommentSection
          addComment={addComment}
          comments={comments}
          updateComments={updateComments}
        />
      )}

      {deleteModal && (
        <Modal>
          <Xmark onClick={() => setdeleteModal(false)} />

          <p style={{ margin: "1rem 0 1rem 0 " }}>
            <b>Are you sure you want to delete this post?</b>
            <br></br>
            Deleted posts can't be retrieved once they are deleted!!
          </p>
          <Button btnText="Delete" onClick={() => deletePost(post._id)} />
          <Button btnText="Cancel" onClick={() => setdeleteModal(false)} />
        </Modal>
      )}

      {editModal && (
        <Modal>
          <Xmark onClick={() => toggleEditModal(false)} />
          <PostEditForm post={post} toggleEditModal={toggleEditModal} />
        </Modal>
      )}

      {likeModal && (
        <Modal>
          <Xmark onClick={() => togglelikeModal(false)} />
          <div className="likeList">
            {likedUsers.map((like) => {
              return (
                <User
                  userId={like.user._id}
                  url={like.user.profileImage}
                  username={like.user.name}
                  headline={like.user.headline}
                />
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
