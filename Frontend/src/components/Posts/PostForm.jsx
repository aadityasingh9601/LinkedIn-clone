import "./PostForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";

export default function PostForm() {
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm();

  const createPost = usePostStore((state) => state.createPost);

  const onSubmit = (data) => {
    //console.log(data);
    const postData = {
      content: data.content,
      media: data.media[0],
      category: data.category,
      postType: data.postType,
    };
    console.log(postData);
    createPost(postData);
    reset();
  };

  //The error was occuri6ng 5because reset was removing the file before it gets submitted.
  return (
    <div className="postform">
      <h3>This is our post form.</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Write your post here"
          {...register("content", {
            required: "Content is required",
            minLength: {
              value: 50,
              message: "Content should be at least 50 characters",
            },
          })}
        />
        {errors.content && <p>{errors.content.message}</p>}
        <br />
        <input
          type="file"
          placeholder="Enter your post image url here"
          {...register("media")}
        />

        <br />
        <input
          type="text"
          placeholder="Category"
          {...register("category", {
            required: "Category is required",
            type: "text",
          })}
        />
        {errors.category && <p>{errors.category.message}</p>}
        <br />
        <input
          type="text"
          placeholder="PostType"
          {...register("postType", {
            required: "Post type is required",
          })}
        />
        {errors.postType && <p>{errors.postType.message}</p>}
        <br />
        <br />

        <Button btnText="Post" />
      </form>
    </div>
  );
}
