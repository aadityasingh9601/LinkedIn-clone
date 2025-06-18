import "./CommentBox.css";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import RHFInput from "../RHFinput";
import useCommentStore from "../../stores/Comment";

export default function CommentBox({ postId }) {
  const addComment = useCommentStore((state) => state.addComment);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (comment) => {
    console.log(comment);
    reset();
    addComment(postId, comment);
  };
  return (
    <div className="commBox">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RHFInput
          placeholder="Add a comment..."
          name="comment"
          register={register}
          rules={{
            required: "Comment is required",
            maxLength: {
              value: 500,
              message: "Comment should not exceed 500 characters",
            },
          }}
          errors={errors}
        />
        <Button type="submit" btnText="Comment" />
      </form>
      <hr />
    </div>
  );
}
