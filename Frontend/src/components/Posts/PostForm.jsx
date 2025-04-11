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

  const [schedule, setSchedule] = useState(false);

  const [postType, setpostType] = useState("Everyone");
  const [preview, setPreview] = useState("");
  // Watch for file changes
  const file = watch("media");

  if (file && file.length > 0) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file[0]); // Convert first file to Base64
  }

  const onSubmit = (data) => {
    console.log(data);
    const postData = {
      content: data.content,
      media: data.media[0],
      category: data.category,
      postType: postType,
      date: data.date,
      time: data.time,
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
              <div className="formBody">
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

                {file && (
                  <div className="previewImg">
                    <div
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "0.3rem",
                        fontSize: "1.25rem",
                      }}
                    >
                      <i
                        className="fa-solid fa-xmark"
                        style={{ zIndex: "10" }}
                        onClick={() => {
                          setValue("media", "");
                        }}
                      ></i>
                    </div>

                    <img src={preview} />
                  </div>
                )}
              </div>

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

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="optionss">
                  <div>
                    <i className="fa-regular fa-face-smile"></i>
                  </div>
                  <div>
                    <label htmlFor="mediaInput">
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

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {schedule ? (
                    <i
                      class="fa-solid fa-clock"
                      onClick={() => setSchedule(false)}
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  ) : (
                    <i
                      class="fa-regular fa-clock"
                      onClick={() => setSchedule(true)}
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  )}

                  <Button btnText="Post" />
                </div>

                {schedule && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-20rem",
                      bottom: "5rem",
                      backgroundColor: "lightblue",
                      padding: "1rem",
                      width: "14rem",
                    }}
                  >
                    <span>Date</span>
                    <input
                      placeholder="dd-mm-yyyy"
                      style={{
                        margin: "0 0 1rem 0",
                      }}
                      {...register("date", {
                        required: schedule ? "Date is required" : false,
                        pattern: {
                          value:
                            /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
                          message: "Enter date in dd-mm-yyyy format",
                        },
                      })}
                    />
                    {errors.date && <p>{errors.date.message}</p>}

                    <span>Time</span>
                    <input
                      placeholder="17:30"
                      style={{
                        margin: "0 0 1rem 0",
                      }}
                      {...register("time", {
                        required: schedule ? "Time is required" : false,
                        pattern: {
                          value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                          message: "Enter time in 24-hour format (HH:mm)",
                        },
                      })}
                    />
                    {errors.time && <p>{errors.time.message}</p>}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
