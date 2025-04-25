import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

import useUserStore from "./User";

const setAllLikedPosts = useUserStore.getState().setAllLikedPosts;

const { newAccessToken } = useUserStore.getState();

const usePostStore = create((set) => ({
  posts: [],

  scheduledPosts: [],

  postFormModal: false,

  setPostFormModal: (value) => {
    set({ postFormModal: value });
  },

  schedule: false,

  setSchedule: (value) => {
    set({ schedule: value });
  },

  showSchPosts: false,

  setshowSchPosts: (value) => {
    set({ showSchPosts: value });
  },

  hasMore: true,

  //To detect our page turn or no. of times posts data have been fetched.
  page: 1,

  createPost: async (postData) => {
    let post;
    console.log(postData);
    try {
      const response = await axios.post(
        "http://localhost:8000/post",
        { postData },

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      //console.log(response);
      post = response.data;
      if (response.status === 201) {
        set({ postFormModal: false });
        console.log(post);

        //Updating the state variable according to the data received.
        if (post.published === true) {
          set((state) => ({
            posts: [post, ...state.posts],
            //Generally we write like posts:[...state.posts,post] it means spread first then add post too
            //but I have reversed the order here, that means post will get added first , that means the newest post
            //will come on top.
          }));
          return toast.success("Post created successfully!");
        } else {
          return toast.success("Post scheduled!");
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  getScheduledPosts: async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/post/scheduled/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status == 200) {
        set({ scheduledPosts: response.data });
      }
      // console.log(response.data);
      //the map & forEach functions are used when updating the state or showing them somewhere, or making some
      //change to them, they are not needed to just normally set state.
    } catch (err) {
      console.log(err);

      return toast.error(err.message);
    }
  },

  fetchPosts: async (userId, page) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/post/${userId}?page=${page}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.length);
      // console.log(response.data);
      //the map & forEach functions are used when updating the state or showing them somewhere, or making some
      //change to them, they are not needed to just normally set state.

      set((state) => ({
        posts: [...state.posts, ...response.data],
      }));
      set({ page: page + 1 });
      set({ hasMore: response.data.length > 0 });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  editPost: async (postId, postData) => {
    console.log(postData);
    try {
      const response = await axios.patch(
        `http://localhost:8000/post/${postId}`,
        { postData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      const updatedPost = response.data.updatedPost;

      if (response.status === 200) {
        set((state) => ({
          //This one is for regular posts.
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  content: updatedPost.content,
                  media: {
                    mediaType: updatedPost.media.mediaType,
                    filename: updatedPost.media.filename,
                    url: updatedPost.media.url,
                  },
                }
              : post
          ),
        }));

        //This one is for scheduled posts.
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((schPost) =>
            schPost._id === postId
              ? {
                  ...schPost,
                  content: updatedPost.content,
                  media: {
                    mediaType: updatedPost.media.mediaType,
                    filename: updatedPost.media.filename,
                    url: updatedPost.media.url,
                  },
                  scheduledTime: updatedPost.scheduledTime,
                }
              : schPost
          ),
        }));

        return toast.success("Post updated successfully!");
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/post/${postId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.status);

      if (response.status === 200) {
        set((state) => ({
          posts: state.posts.filter((post) => post._id !== postId),
          scheduledPosts: state.scheduledPosts.filter(
            (schPost) => schPost._id !== postId
          ),
        }));
        return toast.success("Post deleted successfully!");
      }
      if (response.status === 401) {
        return toast.error("You are not the owner of this post.");
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  likePost: async (postId) => {
    console.log(postId);
    try {
      const response = await axios.post(
        `http://localhost:8000/post/${postId}/like`,
        {},
        { withCredentials: true }
      );
      console.log(response);
      //Add the postId that is liked into the allLikedPosts stored in the localStorage to persist state.
      setAllLikedPosts("add", postId);
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/post/${postId}/like`,
        { withCredentials: true }
      );
      console.log(response);
      //Delete the postId that is unliked from the allLikedPosts stored in the localStorage to persist state.
      setAllLikedPosts("remove", postId);
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  //Add a comment.Transfered to post component, to update comments(local state variable).

  //Get all comments.

  //Edit comment.

  //Delete comment.
}));

export default usePostStore;
