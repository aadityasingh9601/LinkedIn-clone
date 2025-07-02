import "./CommentSection.css";
import { lazy, Suspense } from "react";
import useCommentStore from "../../stores/Comment";

const CommentBox = lazy(() => import("./CommentBox"));
const Comment = lazy(() => import("./Comment"));

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
      <Suspense fallback={<div>Loading...</div>}>
        <CommentBox postId={postId} />
      </Suspense>
      <div className="comments">
        {comments.map((comment) => {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <Comment key={comment._id} comment={comment} />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
}
