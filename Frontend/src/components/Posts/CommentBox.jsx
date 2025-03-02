import "./CommentBox.css";
import Button from "../Button.";
import { useForm } from "react-hook-form";

export default function CommentBox({ addComment }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (comment) => {
    console.log(comment);
    reset();
    addComment(comment);
  };
  return (
    <div className="commBox">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Add a comment..."
          {...register("comment", {
            required: "Comment is required",
            maxLength: {
              value: 500,
              message: "Comment should not exceed 500 characters",
            },
          })}
        />
        {errors.comment && <p>{errors.comment.message}</p>}
        <Button type="submit" btnText="Comment" />
      </form>
      <hr />
    </div>
  );
}
