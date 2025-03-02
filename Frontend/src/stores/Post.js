import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

import useUserStore from "./User";

const { newAccessToken } = useUserStore.getState();

const usePostStore = create((set) => ({
  posts: [], //Just start with an empty array, and not any initial value so that no extra post is created automatically.

  createPost: async (postData) => {
    let post;
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

      console.log(response.data);
      post = response.data;
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
    //Updating the state variable according to the data received.
    set((state) => ({
      posts: [post, ...state.posts],
      //Generally we write like posts:[...state.posts,post] it means spread first then add post too
      //but I have reversed the order here, that means post will get added first , that means the newest post
      //will come on top.
    }));
  },

  getAllPosts: async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/post/${userId}`, {
        withCredentials: true,
      });
      // console.log(response.data);
      //the map & forEach functions are used when updating the state or showing them somewhere, or making some
      //change to them, they are not needed to just normally set state.
      set(() => ({
        posts: response.data,
      }));
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
      const updatedPost = response.data.post;

      if (response.status === 200) {
        set((state) => ({
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

  //State variable to store the users who have liked a post.
  //likedUsers:[];
  //The problem with this method is that u r storing this as a global state so for each post , each post's likedusers
  //will be shown because every post is using a single global state, so instead of creating a global state, we
  // have to create a local state for storing likedUsers , in this way every post will have their own likedUsers
  //array. Remember this for the future also, add to the notes and decide carefully from now on that when to
  //create global state and when to create local state. You can't just put everything together in the zustand store.
  //
  //

  likePost: async (postId) => {
    console.log(postId);
    try {
      const response = await axios.post(
        `http://localhost:8000/post/${postId}/like`,
        {},
        { withCredentials: true }
      );
      console.log(response);
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
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  },

  //Get all likes.Transfered to the post component.

  //Add a comment.Transfered to post component, to update comments(local state variable).

  //Get all comments.

  //Edit comment.

  //Delete comment.
}));

export default usePostStore;
