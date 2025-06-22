import "./CommentSection.css";
import CommentBox from "./CommentBox";
import Comment from "./Comment";
import { useEffect } from "react";
import useCommentStore from "../../stores/Comment";

export default function CommentSection({
  postId,
  comments,
  showComments,
  setshowComments,
}) {
  const fetchComments = useCommentStore((state) => state.fetchComments);
  useEffect(() => {
    if (showComments) {
      fetchComments(postId);
    }
  }, [showComments]);

  return (
    <div className="commSection">
      <CommentBox postId={postId} />
      <div className="comments">
        {comments.map((comment) => {
          return <Comment key={comment._id} comment={comment} />;
        })}
      </div>
    </div>
  );
}
