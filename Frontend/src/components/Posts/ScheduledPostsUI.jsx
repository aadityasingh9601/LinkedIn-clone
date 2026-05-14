import styles from "./ScheduledPostsUI.module.css";
import Button from "../shared-components/Buttons/Button";
import usePostStore from "../../stores/Post";
import { useEffect, lazy, Suspense } from "react";
import useUserStore from "../../stores/User";
import ScheduledPost from "./ScheduledPost";

const SchPost = lazy(() => import("./ScheduledPost"));

export default function ScheduledPostsUI() {
  const currUserId = useUserStore((state) => state.currUserId);
  const scheduledPosts = usePostStore((state) => state.scheduledPosts);
  const setShowScheduledPosts = usePostStore((state)=>state.setShowScheduledPosts)
  const getScheduledPosts = usePostStore((state) => state.getScheduledPosts);

  useEffect(() => {
    getScheduledPosts(currUserId);
  }, []);

  return (
    <div className={styles.scheduledPostsUI}>
      <div className={styles.header}><div>Scheduled Posts</div></div>
      <div className={styles.body}>
        {scheduledPosts.length === 0 ? (
          <div
            className={styles.fallbackUI}
          >
            You have not scheduled any posts yet!
          </div>
        ) : (
          scheduledPosts?.map((p) => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <ScheduledPost key={p._id} scheduledPost={p}  />
              </Suspense>
            );
          })
        )}
      </div>

      <div className={styles.footer}>
        <Button btnText="Back" variant="sm" onClick={() =>  setShowScheduledPosts(false)} />
      </div>
    </div>
  );
}
