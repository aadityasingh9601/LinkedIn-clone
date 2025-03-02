import "./PostEditForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";

export default function PostEditForm({ post, toggleEditModal }) {
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm();

  const editPost = usePostStore((state) => state.editPost);

  const onSubmit = async (data) => {
    // const postData = {
    //   content: data.content,
    //   media: data.media[0],
    //   category: data.category,
    //   postType: data.postType,
    // };

    const postData = {
      ...data,
      media: data.media[0],
    };

    console.log(postData);

    editPost(post._id, postData);
  };
  return (
    <div className="posteditform">
      <h3>Edit your post.</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          type="text"
          placeholder="Write your post here..."
          {...register("content", {
            required: "Content is required",
            minLength: {
              value: 50,
              message: "Content should be at least 50 characters",
            },
          })}
        >
          {post.content}
        </textarea>
        {errors.content && <p>{errors.content.message}</p>}
        <br />
        <span>
          <b>Orignal image</b>
        </span>
        <br />
        <img height="200px" width="200px" src={post.media.url} alt="" />
        <input
          type="file"
          placeholder="Enter your post image url here"
          {...register("media")}
        />
        <br />
        <textarea
          type="text"
          value={post.category}
          placeholder="Category"
          {...register("category", {
            required: "Category is required",
            type: "text",
          })}
        ></textarea>
        {errors.category && <p>{errors.category.message}</p>}
        <br />
        <br />
        <Button btnText="Cancel" onClick={() => toggleEditModal(false)} />
        <Button btnText="Save Changes" />
      </form>
    </div>
  );
}
