import "./CommentSection.css";
import CommentBox from "./CommentBox";
import Comment from "./Comment";

export default function CommentSection({
  addComment,
  comments,
  updateComments,
}) {
  return (
    <div className="commSection">
      <CommentBox addComment={addComment} />
      <div className="comments">
        {comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              comment={comment}
              updateComments={updateComments}
            />
          );
        })}
      </div>
    </div>
  );
}
