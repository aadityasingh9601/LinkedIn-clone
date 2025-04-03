import "./Homepage.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PostForm from "./Posts/PostForm";
import usePostStore from "../stores/Post"; //Import the store first.
import Post from "./Posts/Post";
import useUserStore from "../stores/User";
import useAnalyticStore from "../stores/Analytic";
import usePollStore from "../stores/Poll";
import InfiniteScroll from "react-infinite-scroll-component";
import PostFormPreview from "./Posts/PostFormPreview";
import Modal from "./Modal";
import Poll from "./Polls/Poll";

export default function Homepage() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const logEvent = useAnalyticStore((state) => state.logEvent);
  const currUserId = useUserStore((state) => state.currUserId);
  const posts = usePostStore((state) => state.posts);
  const fetchPosts = usePostStore((state) => state.fetchPosts);
  const hasMore = usePostStore((state) => state.hasMore);
  const page = usePostStore((state) => state.page);
  const fetchAllPolls = usePollStore((state) => state.fetchAllPolls);
  const polls = usePollStore((state) => state.polls);

  const postFormModal = usePostStore((state) => state.postFormModal);
  const setPostFormModal = usePostStore((state) => state.setPostFormModal);
  const getAllLikedPosts = useUserStore((state) => state.getAllLikedPosts);
  const allLikedPosts = useUserStore((state) => state.allLikedPosts);
  console.log(allLikedPosts);
  //Intersection Observer part starts here.

  const [viewedPostIds, setViewedPostIds] = useState(new Set()); // Use Set to avoid duplicates
  const observer = useRef(null); //Create your observer for posts.

  useEffect(() => {
    if (!posts.length) return; // Ensure posts exist before setting up observer

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");
            console.log(postId);
            if (postId && !viewedPostIds.has(postId)) {
              setViewedPostIds((prev) => new Set(prev).add(postId)); // Prevent duplicates
            }
          }
        });
      },
      { threshold: 0.5 } //Means set a post as viewed only when atleast 50% of the post has came into the viewport.
    );

    const postElements = document.querySelectorAll(".post");
    postElements.forEach((post) => observer.current.observe(post));

    return () => observer.current.disconnect();
  }, [posts]); // Runs when posts update

  // Send impressions after a delay to avoid multiple requests
  useEffect(() => {
    if (viewedPostIds.size > 0) {
      const timer = setTimeout(() => {
        let eventData = {
          postIds: Array.from(viewedPostIds), // Convert Set to array before sending
          eventType: "post_impression",
        };
        logEvent(eventData);
        setViewedPostIds(new Set()); // Reset after sending to avoid duplicate API calls
      }, 2000); // Delay to reduce API spam

      return () => clearTimeout(timer);
    }
  }, [viewedPostIds]);

  //Intersection Observer part ends here.

  useEffect(() => {
    if (isLoggedIn) {
      getAllLikedPosts();
    }
  }, [currUserId]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts(currUserId, page);
    }
  }, [currUserId]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllPolls();
    }
  }, [currUserId]);

  const fetchMoreData = () => {
    fetchPosts(currUserId, page);
  };

  //To ensure that we can't scroll the page while the modal is open.
  if (postFormModal) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  return (
    <div className="homepage">
      {/* <Button btnText="Join Group" onClick={handleJoin} />
        <Button btnText="Connect" onClick={sendReq} /> */}
      <div className="sideTab">This is our sideTab.</div>
      <div className="feed">
        <PostFormPreview />
        <hr></hr>

        {postFormModal && (
          <div>
            <Modal>
              <i
                class="fa-solid fa-xmark cross"
                onClick={() => setPostFormModal(false)}
              ></i>
              <PostForm />
            </Modal>
          </div>
        )}

        <div className="polls">
          {polls.map((poll) => {
            return <Poll key={poll._id} poll={poll} />;
          })}
        </div>

        <div className="posts">
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            //You can create your own good looking custom loader here also.
            loader={<div className="loader">Loading...</div>}
          >
            {posts.map((post) => {
              return <Post key={post._id} post={post} />; // We're mapping through the posts array and returning a Post component for each post.
            })}
          </InfiniteScroll>
        </div>
      </div>
      <div className="sideTab2">This is our sideTab2.</div>
    </div>
  );
}
