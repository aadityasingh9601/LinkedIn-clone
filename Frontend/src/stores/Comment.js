import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useCommentStore = create((set) => ({
  comments: [],
  //Creating function to filter the comments state variable after post deletion.
  updateComments: (commentId) => {
    set((state) => ({
      comments: state.comments.filter((c) => c._id !== commentId),
    }));
  },

  fetchComments: async (postId) => {
    tryCatchWrapper(async () => {
      console.log(postId);
      const response = await apiGet(`/post/${postId}/comment`);
      set({ comments: response.data });
    });
  },

  addComment: async (postId, comment) => {
    let newComment;

    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/post/${postId}/comment`,
        { comment },
        {}
      );
      console.log(response.data);
      newComment = response.data;
      if (response.status === 201) {
        set((state) => ({
          comments: [...state.comments, newComment],
        }));
        return toast.success("Comment added!");
      }
    });
  },

  editComment: async (postId, commentId, newComment, updateCommEdit) => {
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/post/${postId}/comment/${commentId}`,
        { newComment },
        {}
      );
      if (response.status === 200) {
        set((state) => ({
          comments: state.comments.map((c) => {
            return c._id === commentId ? { ...c, text: response.data } : c;
          }),
        }));
        updateCommEdit(false);
        return toast.success("Comment updated!");
      }
    });
  },

  deleteComment: async (postId, commentId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/post/${postId}/comment/${commentId}`);
      console.log(response);
      if (response.status === 200) {
        set((state) => ({
          comments: state.comments.filter((c) => c._id !== commentId),
        }));
        return toast.success("Comment deleted!");
      }
    });
  },
}));

export default useCommentStore;
