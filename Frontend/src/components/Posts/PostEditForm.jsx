import "./PostEditForm.css";
import usePostStore from "../../stores/Post";
import Button from "../Button.";
import { useForm } from "react-hook-form";
import { parseISODate } from "../../utils/helper";
import RHFtextarea from "../RHFtextarea";

export default function PostEditForm({ post }) {
  const { date, time } = parseISODate(post?.scheduledTime);
  const schedule = usePostStore((state) => state.schedule);
  const setSchedule = usePostStore((state) => state.setSchedule);
  const {
    register,
    handleSubmit,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: post.content,
      category: post.category.map((e) => e + ","),
      date: date,
      time: time,
    },
  });

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
    };

    if (data.media && data.media.length > 0) {
      postData.media = data.media[0];
    }

    console.log(postData);

    editPost(post._id, postData);
  };
  return (
    <div className="posteditform">
      <h3>Edit your post.</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RHFtextarea
          placeholder="Write your post here..."
          register={register}
          errors={errors}
          name="content"
          rules={{
            required: "Content is required",
            minLength: {
              value: 50,
              message: "Content should be at least 50 characters",
            },
          }}
        />

        {errors.content && <p>{errors.content.message}</p>}
        <br />
        {post.media.url && (
          <div>
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
          </div>
        )}
        <br />

        <input
          type="text"
          style={{ width: "100%" }}
          placeholder="Category"
          {...register("category", {
            required: "Category is required",
            type: "text",
          })}
        />
        {errors.category && <p>{errors.category.message}</p>}
        <br />
        <br />
        {/* Show only if post isn't published yet. */}
        {post.published === false && (
          <div style={{ display: "inline" }}>
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
          </div>
        )}
        <Button btnText="Save Changes" />
        {schedule && (
          <div
            style={{
              position: "absolute",
              right: "-20rem",
              bottom: "5rem",
              backgroundColor: "lightblue",
              padding: "1rem",
              width: "14rem",
              textAlign: "start",
            }}
          >
            <div>Date</div>
            <input
              placeholder="dd-mm-yyyy"
              style={{
                margin: "0 0 1rem 0",
                width: "95%",
              }}
              {...register("date", {
                required: schedule ? "Date is required" : false,
                pattern: {
                  value: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
                  message: "Enter date in dd-mm-yyyy format",
                },
              })}
            />
            {errors.date && <p>{errors.date.message}</p>}

            <div>Time</div>
            <input
              placeholder="17:30"
              style={{
                margin: "0 0 1rem 0",
                width: "95%",
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

            <Button
              onClick={() => {
                setshowSchPosts(true), console.log("clikced");
              }}
              btnText="View all scheduled posts"
            />
          </div>
        )}
      </form>
    </div>
  );
}
