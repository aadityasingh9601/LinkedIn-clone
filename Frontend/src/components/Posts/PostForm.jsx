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
import { zodResolver } from "@hookform/resolvers/zod";
import { PostDataSchema } from "../../zodSchema";
import Spinner from "../../icons/spinners/Spinner";
import RHFselect from "../RHFselect";

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
  } = useForm({ resolver: zodResolver(PostDataSchema) });

  const [isLoading, setIsLoading] = useState(false);
  const createPost = usePostStore((state) => state.createPost);
  const poll = usePostStore((state) => state.poll);
  const setPoll = usePostStore((state) => state.setPoll);
  const schedule = usePostStore((state) => state.schedule);
  const setSchedule = usePostStore((state) => state.setSchedule);
  const showSchPosts = usePostStore((state) => state.showSchPosts);
  const setshowSchPosts = usePostStore((state) => state.setshowSchPosts);

  const userProfile = JSON.parse(localStorage.getItem("currUserProfile"));

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
      ...data,
      media: data.media[0],
    };
    console.log(postData);
    createPost(postData, setIsLoading);
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
              <img src={userProfile?.profileImage?.url} />
            </div>
            <div>{userProfile?.name}</div>
            <div>
              <RHFselect
                name="postType"
                register={register}
                styles={{ display: "inline" }}
                options={["Everyone", "Connections only!"]}
                errors={errors}
              />
            </div>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="formBody">
                <RHFtextarea
                  placeholder="Write your post here"
                  register={register}
                  name="content"
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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    btnText={isLoading ? <Spinner /> : "Post"}
                  />
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
                      errors={errors}
                    />
                    <Button
                      onClick={() => {
                        setshowSchPosts(true);
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
