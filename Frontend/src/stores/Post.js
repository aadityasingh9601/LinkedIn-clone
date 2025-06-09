import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

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
    tryCatchWrapper(async () => {
      const response = await apiPost(
        "/post",
        { postData },
        {
          "Content-Type": "multipart/form-data",
        }
      );

      console.log(response);
      post = response.data;
      if (response.status === 201) {
        set({ postFormModal: false });
        console.log(post);

        //Updating the state variable according to the data received.
        if (post.published === true && post.postType === "Everyone") {
          set((state) => ({
            posts: [post, ...state.posts],
            //Generally we write like posts:[...state.posts,post] it means spread first then add post too
            //but I have reversed the order here, that means post will get added first , that means the newest post
            //will come on top.
          }));
          return toast.success("Post created successfully!");
        } else if (post.postType === "Connections only") {
          return toast.success("Post created successfully!");
        } else {
          return toast.success("Post scheduled!");
        }
      }
    });
  },

  updatePost: (data) => {
    set((state) => ({
      posts: [data, ...state.posts],
    }));
  },

  getScheduledPosts: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/post/scheduled/${userId}`);

      console.log(response);
      if (response.status == 200) {
        set({ scheduledPosts: response.data });
      }
      // console.log(response.data);
      //the map & forEach functions are used when updating the state or showing them somewhere, or making some
      //change to them, they are not needed to just normally set state.
    });
  },

  fetchPosts: async (userId, page) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/post/${userId}?page=${page}`);

      console.log(response.data.length);
      // console.log(response.data);
      //the map & forEach functions are used when updating the state or showing them somewhere, or making some
      //change to them, they are not needed to just normally set state.

      set((state) => ({
        posts: [...state.posts, ...response.data],
      }));
      set({ page: page + 1 });
      set({ hasMore: response.data.length > 0 });
    });
  },

  editPost: async (postId, postData) => {
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/post/${postId}`,
        { postData },
        {
          "Content-Type": "multipart/form-data",
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
    });
  },

  deletePost: async (postId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/post/${postId}`);

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
    });
  },

  likePost: async (postId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/post/${postId}/like`, {}, {});
      console.log(response);
      //Add the postId that is liked into the allLikedPosts stored in the localStorage to persist state.
      setAllLikedPosts("add", postId);
    });
  },

  unlikePost: async (postId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/post/${postId}/like`);
      console.log(response);
      //Delete the postId that is unliked from the allLikedPosts stored in the localStorage to persist state.
      setAllLikedPosts("remove", postId);
    });
  },

  getAllLikes: async (postId) => {
    tryCatchWrapper(async () => {
      const response = apiGet(`/post/${postId}/like`);
      setlikedUsers(response.data);
    });
  },
}));

export default usePostStore;
