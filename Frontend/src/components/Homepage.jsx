import "./Homepage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import PostForm from "./Posts/PostForm";
import usePostStore from "../stores/Post"; //Import the store first.
import Post from "./Posts/Post";
import useUserStore from "../stores/User";
import Chat from "./Messaging/Chat";

import { toast } from "react-toastify";

export default function Homepage() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const currUserId = useUserStore((state) => state.currUserId);
  const posts = usePostStore((state) => state.posts);
  const getAllPosts = usePostStore((state) => state.getAllPosts);

  useEffect(() => {
    if (isLoggedIn) {
      getAllPosts(currUserId);
    }
  }, [currUserId]);

  async function handleJoin() {
    try {
      let response = await axios.post(
        "http://localhost:8000/groups/66f7cc339637f8475318c3e3/join",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const showModal = true;
  {
    return (
      <div className="homepage">
        {/* <Button btnText="Join Group" onClick={handleJoin} />
        <Button btnText="Connect" onClick={sendReq} /> */}
        <div className="sideTab">This is our sideTab.</div>
        <div className="feed">
          <PostForm />
          <hr></hr>

          <div className="posts">
            {posts.map((post) => {
              return <Post key={post._id} post={post} />; // We're mapping through the posts array and returning a Post component for each post.
            })}
          </div>
        </div>
        <div className="sideTab2">This is our sideTab2.</div>
      </div>
    );
  }
}
