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
import FormWrapper from "../shared-components/Forms/FormWrapper";
import EmojiPicker from "emoji-picker-react";
const PollForm = lazy(() => import("../Polls/PollForm"));
const ScheduledPostsUI = lazy(() => import("./ScheduledPostsUI"));

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const createPost = usePostStore((state) => state.createPost);
  const poll = usePostStore((state) => state.poll);
  const setPoll = usePostStore((state) => state.setPoll);
  const schedule = usePostStore((state) => state.schedule);
  const setSchedule = usePostStore((state) => state.setSchedule);
  const showScheduledPosts = usePostStore((state) => state.showScheduledPosts);
  const setShowScheduledPosts = usePostStore(
    (state) => state.setShowScheduledPosts,
  );
  const currUserProfile = useUserStore((state) => state.currUserProfile);

  const [preview, setPreview] = useState(null);
  // Watch for file changes
  const file = watch("media");
  const existingContent = watch("content");

  if (file && file.length > 0) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file[0]); // Convert first file to Base64
  }

  const handleEmojiClick = (emojiObject) => {
    //console.log(emojiObject);
    setValue("content", existingContent + emojiObject.emoji);
  };

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

  return (
    <div>
      {poll ? (
        <Suspense fallback={<div>Loading...</div>}>
          <PollForm />
        </Suspense>
      ) : showScheduledPosts ? (
        <Suspense fallback={<div>Loading...</div>}>
          <ScheduledPostsUI/>
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
            <div className={styles.postType}>
              <RHFselect
                name="postType"
                register={register}
                options={["Everyone", "Connections only"]}
                errors={errors}
              />
            </div>
          </div>
          <div className={styles.form}>
            <FormWrapper onSubmit={handleSubmit(onSubmit)} id="postform">
              <div className={styles.formBody}>
                <RHFtextarea
                  placeholder="Write your post here"
                  register={register}
                  name="content"
                  customStyles={{ height: "15rem" }}
                  errors={errors}
                />

                {preview && (
                  <div className={styles.previewImg}>
                    <div className={styles.xmark}>
                      <Xmark
                        onClick={() => {
                          setValue("media", "");
                        }}
                      />
                    </div>

                    <img src={preview} />
                  </div>
                )}
              </div>

              <div className={styles.postOptions}>
                <div className={styles.emojiWrapper}>
                  <div onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    {showEmojiPicker ? <SmileS /> : <SmileR />}
                  </div>
                  <div className={styles.emojiPicker}>
                    {showEmojiPicker && (
                      <EmojiPicker
                        height={350}
                        width={300}
                        onEmojiClick={handleEmojiClick}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="mediaInput">
                    <ImageIcon />
                  </label>
                  <RHFInput
                    id="mediaInput"
                    type="file"
                    customClass={styles.hidden}
                    placeholder="Enter your post image url here"
                    name="media"
                    register={register}
                  />
                </div>
                <div>
                  <Pollicon onClick={() => setPoll(true)} />
                </div>
              </div>
            </FormWrapper>
            <div className={styles.footer}>
              <div className={styles.footerOptions}>
                {schedule ? (
                  <ClockS onClick={() => setSchedule(false)} />
                ) : (
                  <ClockR onClick={() => setSchedule(true)} />
                )}

                <Button
                  type="submit"
                  form="postform"
                  variant="sm"
                  disabled={isLoading}
                  btnText={
                    isLoading ? <Spinner height={17} width={17} /> : schedule ? "Schedule" : "Post"
                  }
                />
              </div>
            </div>

            <div className={styles.postSchedulerWrapper}>
              {/* Post Scheduler component */}
              {schedule && (
                <div className={styles.postScheduler}>
                  <RHFInput
                    customClass={styles.schedulerInput}
                    label="Date"
                    placeholder="dd-mm-yyyy"
                    name="date"
                    register={register}
                    errors={errors}
                  />
                  <RHFInput
                    label="Time"
                    customClass={styles.schedulerInput}
                    placeholder="17:30"
                    register={register}
                    name="time"
                    errors={errors}
                  />
                  <Button
                    variant="sm"
                    onClick={() => {
                      setShowScheduledPosts(true);
                    }}
                    btnText="View all scheduled posts"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
