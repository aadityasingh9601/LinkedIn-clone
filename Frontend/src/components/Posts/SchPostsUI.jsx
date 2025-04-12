import Button from "../Button.";
import "./SchPostUI.css";
import usePostStore from "../../stores/Post";
import SchPost from "./SchPost";
import { useEffect } from "react";
import useUserStore from "../../stores/User";

export default function SchPostsUI() {
  const currUserId = useUserStore((state) => state.currUserId);
  const scheduledPosts = usePostStore((state) => state.scheduledPosts);
  const setshowSchPosts = usePostStore((state) => state.setshowSchPosts);
  const getScheduledPosts = usePostStore((state) => state.getScheduledPosts);

  useEffect(() => {
    getScheduledPosts(currUserId);
  }, []);

  return (
    <div className="schPostUI">
      <div className="head">Scheduled Posts</div>
      <div className="main">
        {scheduledPosts.length === 0 ? (
          <div
            style={{
              backgroundColor: "pink",
              height: "100%",
              width: "100%",
            }}
          >
            You haven't scheduled any posts yet.
          </div>
        ) : (
          scheduledPosts.map((schPost) => {
            return <SchPost key={schPost._id} schPost={schPost} />;
          })
        )}
      </div>

      <Button btnText="Back" onClick={() => setshowSchPosts(false)} />
    </div>
  );
}
