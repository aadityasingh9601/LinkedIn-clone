import "./PostForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { useEffect, useState, lazy, Suspense } from "react";
import RHFtextarea from "../RHFtextarea";
import Xmark from "../../icons/Xmark";
import SmileR from "../../icons/SmileR";
import SmileS from "../../icons/SmileS";
import ClockS from "../../icons/ClockS";
import ClockR from "../../icons/ClockR";
import ImageIcon from "../../icons/ImageIcon";
import RHFInput from "../RHFInput";
import Pollicon from "../../icons/PollIcon";

const PollForm = lazy(() => import("../Polls/PollForm"));
const SchPostsUI = lazy(() => import("./SchPostsUI"));

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

  const poll = usePostStore((state) => state.poll);
  const setPoll = usePostStore((state) => state.setPoll);
  const schedule = usePostStore((state) => state.schedule);
  const setSchedule = usePostStore((state) => state.setSchedule);
  const showSchPosts = usePostStore((state) => state.showSchPosts);
  const setshowSchPosts = usePostStore((state) => state.setshowSchPosts);

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
        <Suspense fallback={<div>Loading...</div>}>
          <PollForm />
        </Suspense>
      ) : showSchPosts ? (
        <Suspense fallback={<div>Loading...</div>}>
          <SchPostsUI />
        </Suspense>
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
                <RHFtextarea
                  placeholder="Write your post here"
                  register={register}
                  name="content"
                  rules={{
                    required: "Content is required",
                    minLength: {
                      value: 50,
                      message: "Content should be at least 50 characters",
                    },
                  }}
                  errors={errors}
                />

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
                      <Xmark
                        style={{ zIndex: "10" }}
                        onClick={() => {
                          setValue("media", "");
                        }}
                      />
                    </div>

                    <img src={preview} />
                  </div>
                )}
              </div>
              <RHFInput
                type="text"
                placeholder="Add some hashtags..."
                name="category"
                register={register}
                rules={{
                  required: "Category is required",
                  type: "text",
                }}
                errors={errors}
              />
              <br />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="optionss">
                  <div>
                    <SmileR />
                  </div>
                  <div>
                    <label htmlFor="mediaInput">
                      <ImageIcon />
                    </label>
                    <RHFInput
                      id="mediaInput"
                      type="file"
                      style={{ display: "none" }}
                      placeholder="Enter your post image url here"
                      name="media"
                      register={register}
                    />
                  </div>
                  <div>
                    <Pollicon onClick={() => setPoll(true)} />
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
                    <ClockS
                      onClick={() => setSchedule(false)}
                      style={{ fontSize: "1.2rem" }}
                    />
                  ) : (
                    <ClockR
                      onClick={() => setSchedule(true)}
                      style={{ fontSize: "1.2rem" }}
                    />
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
                    <RHFInput
                      placeholder="dd-mm-yyyy"
                      style={{
                        margin: "0 0 1rem 0",
                      }}
                      name="date"
                      register={register}
                      rules={{
                        required: schedule ? "Date is required" : false,
                        pattern: {
                          value:
                            /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
                          message: "Enter date in dd-mm-yyyy format",
                        },
                      }}
                      errors={errors}
                    />
                    <span>Time</span>
                    <RHFInput
                      placeholder="17:30"
                      style={{
                        margin: "0 0 1rem 0",
                      }}
                      register={register}
                      name="time"
                      rules={{
                        required: schedule ? "Time is required" : false,
                        pattern: {
                          value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                          message: "Enter time in 24-hour format (HH:mm)",
                        },
                      }}
                      errors={errors}
                    />
                    <Button
                      onClick={() => {
                        setshowSchPosts(true), console.log("clikced");
                      }}
                      btnText="View all scheduled posts"
                    />
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
