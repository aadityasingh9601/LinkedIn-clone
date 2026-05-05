import styles from "./PostForm.module.css";
import usePostStore from "../../stores/Post";
import Button from "../shared-components/Buttons/Button";
import { useForm } from "react-hook-form";
import { useEffect, useState, lazy, Suspense } from "react";
import Xmark from "../shared-components/Icons/Xmark";
import SmileR from "../shared-components/Icons/SmileR";
import SmileS from "../shared-components/Icons/SmileS";
import ClockS from "../shared-components/Icons/ClockS";
import ClockR from "../shared-components/Icons/ClockR";
import ImageIcon from "../shared-components/Icons/ImageIcon";
import RHFInput from "../shared-components/Inputs/RHFInput";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import Pollicon from "../shared-components/Icons/PollIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostDataSchema } from "../../zodSchema";
import Spinner from "../shared-components/Loaders/Spinner";
import RHFselect from "../shared-components/Select/RHFselect";
import UserInfo from "../shared-components/User/UserInfo";
import useUserStore from "../../stores/User";
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
  const currUserProfile = useUserStore((state) => state.currUserProfile);

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
        <div className={styles.postform}>
          <div className={styles.header}>
            <UserInfo
              userId={currUserProfile?.userId}
              username={currUserProfile?.name}
              url={currUserProfile?.profileImage?.url}
              headline={currUserProfile?.headline}
            />
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
          <div className={styles.form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="formBody">
                <RHFtextarea
                  placeholder="Write your post here"
                  register={register}
                  name="content"
                  errors={errors}
                />

                {file && (
                  <div className={styles.previewImg}>
                    <div>
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
