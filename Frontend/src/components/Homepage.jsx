import "./Homepage.css";
import { useEffect, useState, useCallback, useRef, lazy } from "react";
import usePostStore from "../stores/Post"; //Import the store first.
import { debounce } from "lodash";
import PostForm from "./Posts/PostForm";
import usePollStore from "../stores/Poll";
import useUserStore from "../stores/User";
import useAnalyticStore from "../stores/Analytic";
import Xmark from "../icons/Xmark";

const Post = lazy(() => import("./Posts/Post"));
const InfiniteScroll = lazy(() => import("react-infinite-scroll-component"));
const PostFormPreview = lazy(() => import("./Posts/PostFormPreview"));
const Modal = lazy(() => import("./Modal"));
const Poll = lazy(() => import("./Polls/Poll"));

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
  const getAllFollowed = useUserStore((state) => state.getAllFollowed);
  const getAllConnections = useUserStore((state) => state.getAllConnections);
  const setshowSchPosts = usePostStore((state) => state.setshowSchPosts);
  //console.log(allLikedPosts);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllPolls();
      fetchPosts(currUserId, page);
    }
  }, [currUserId]);

  useEffect(() => {
    if (isLoggedIn) {
      getAllLikedPosts();
      getAllFollowed();
      getAllConnections(currUserId);
    }
  }, [currUserId]);

  const fetchMoreData = () => {
    fetchPosts(currUserId, page);
  };

  //Function to send logEvent requests to the backend.
  const sendToBackend = useCallback(
    debounce(() => {
      if (viewedPostIds.current.size > 0) {
        let eventData = {
          postIds: Array.from(viewedPostIds.current), // Convert Set to array before sending
          eventType: "post_impression",
        };
        logEvent(eventData);
        //clear the viewedPostIds after sending request to backend.
        viewedPostIds.current.clear();
      }
    }, 2000),
    [] //Add dependency, when this function should create again.
  );

  //Intersection Observer part starts here.

  const viewedPostIds = useRef(new Set());
  const observer = useRef(null); //Create your observer for posts.

  const postRefs = useRef({});
  console.log(postRefs);

  const IOCallback = (entries) => {
    entries.forEach((entry) => {
      // console.log(entry);
      if (entry.isIntersecting) {
        const postId = entry.target.getAttribute("data-post-id");
        //console.log(postId);
        if (postId && !viewedPostIds.current.has(postId)) {
          viewedPostIds.current.add(postId); // Prevent duplicates
          //console.log(viewedPostIds.current);
        }
        // Stop observing this element after first intersection
        observer.current.unobserve(entry.target);

        //As a post is detected,send backend request to log analytics event for it.
        sendToBackend();
      }
    });
  };

  const IOoptions = { threshold: 0.75 };

  useEffect(() => {
    if (!posts.length) return;

    observer.current = new IntersectionObserver(IOCallback, IOoptions);

    //observe all the posts.
    Object.values(postRefs.current).forEach((node) => {
      if (node) {
        observer.current?.observe(node);
      }
    });

    //unobserve all the posts.
    return () => {
      if (observer && postRefs.current) {
        Object.values(postRefs.current).forEach((node) => {
          if (node instanceof Element) {
            observer.current.unobserve(node);
          }
        });
      }
    };
  }, [posts]); // Runs when posts update

  // Assign ref to each post
  const setRef = (node, id) => {
    //console.log(node);
    if (node) {
      postRefs.current[id] = node;
    }
  };

  //Intersection Observer part ends here.

  //To ensure that we can't scroll the page while the modal is open.
  if (postFormModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  return (
    <div className="homepage">
      {/* <Button btnText="Join Group" onClick={handleJoin} />
        <Button btnText="Connect" onClick={sendReq} /> */}
      {/* <div className="sideTab">This is our sideTab.</div> */}
      <div className="feed">
        <PostFormPreview />
        <hr></hr>

        {postFormModal && (
          <div>
            <Modal>
              <Xmark
                onClick={() => {
                  setPostFormModal(false), setshowSchPosts(false);
                }}
              />

              <PostForm />
            </Modal>
          </div>
        )}

        <div className="polls">
          {polls.map((poll) => {
            return <Poll key={poll._id} poll={poll} />;
          })}
        </div>

        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          //You can create your own good looking custom loader here also.
          loader={<div className="loader">Loading...</div>}
        >
          <div className="posts">
            {posts.map((post) => {
              return (
                <Post
                  key={post._id}
                  post={post}
                  postRef={(node) => setRef(node, post._id)}
                />
              ); // We're mapping through the posts array and returning a Post component for each post.
            })}
          </div>
        </InfiniteScroll>
      </div>
      {/* <div className="sideTab2">This is our sideTab2.</div> */}
    </div>
  );
}
