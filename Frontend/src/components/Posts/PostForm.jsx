import "./PostForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function PostForm() {
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm();

  const createPost = usePostStore((state) => state.createPost);

  const [postType, setpostType] = useState("Anyone");

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
      <div className="header">
        <div className="img">
          <img src="https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180" />
        </div>
        <div>Aaditya Singh</div>
        <div>
          <select
            value={postType}
            onChange={(event) => {
              setpostType(event.target.value);
            }}
            className="analyticDropdown"
          >
            <option value="anyone">Anyone</option>
            <option value="connections">Connection only</option>
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
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
        <div className="options">
          <div>
            <i className="fa-regular fa-face-smile"></i>
          </div>
          <div>
            <label for="mediaInput">
              <i class="fa-regular fa-image"></i>
            </label>
            <input
              id="mediaInput"
              type="file"
              style={{ display: "none" }}
              placeholder="Enter your post image url here"
              {...register("media")}
            />
          </div>

          <div>
            <i class="fa-solid fa-square-poll-vertical"></i>
          </div>
        </div>

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
