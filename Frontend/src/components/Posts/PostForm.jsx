import "./PostForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import PollForm from "../Polls/PollForm";
import usePollStore from "../../stores/Poll";

export default function PostForm() {
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const createPost = usePostStore((state) => state.createPost);

  const poll = usePollStore((state) => state.poll);
  const setPoll = usePollStore((state) => state.setPoll);

  const [postType, setpostType] = useState("Everyone");
  const fileName = watch("media") || "";

  const onSubmit = (data) => {
    //console.log(data);
    const postData = {
      content: data.content,
      media: data.media[0],
      category: data.category,
      postType: postType,
    };
    console.log(postData);
    createPost(postData);
    reset();
  };

  //The error was occuri6ng 5because reset was removing the file before it gets submitted.
  return (
    <div>
      {poll ? (
        <PollForm />
      ) : (
        <div className="postform">
          <div className="header">
            <div className="img">
              <img src="https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180" />
            </div>
            <div>Aaditya Singh</div>
            <div>
              <select
                style={{ display: "inline" }}
                value={postType}
                onChange={(event) => {
                  setpostType(event.target.value);
                }}
              >
                <option>Everyone</option>
                <option>Connections only</option>
              </select>
            </div>
          </div>
          <div className="form">
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

              <input
                type="text"
                placeholder="Add some hashtags..."
                {...register("category", {
                  required: "Category is required",
                  type: "text",
                })}
              />
              {errors.category && <p>{errors.category.message}</p>}

              <br />

              {fileName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0 0 0.4rem 0",
                  }}
                >
                  <i
                    className="fa-solid fa-xmark"
                    style={{ margin: "0 0.3rem 0 0 " }}
                    onClick={() => {
                      setValue("media", "");
                    }}
                  ></i>
                  <div>{fileName[0]?.name}</div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="optionss">
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
                    <i
                      class="fa-solid fa-square-poll-vertical"
                      onClick={() => setPoll(true)}
                    ></i>
                  </div>
                </div>

                <Button btnText="Post" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
