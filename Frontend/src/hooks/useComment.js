import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../stores/User";
function useComment(postId) {
  const [comments, setComments] = useState([]);
  const [showComments, setshowComments] = useState(false);
  const newAccessToken = useUserStore((state) => state.newAccessToken);

  //Fetch comments of a post when comment section is opened.
  const getAllComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/post/${postId}/comment`,
        { withCredentials: true }
      );
      console.log(response.data);
      setComments(response.data);
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  };

  //Creating function to add comment and updating the local state variable comments.
  const addComment = async (comment) => {
    let newComment;
    try {
      const response = await axios.post(
        `http://localhost:8000/post/${postId}/comment`,
        { comment },
        { withCredentials: true }
      );
      console.log(response.data);
      newComment = response.data;
      if (response.status === 201) {
        setComments((prevComments) => {
          return [...prevComments, newComment];
        });

        return toast.success("Comment added!");
      }
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        newAccessToken();
        return toast.error("Something went wrong! Please try again.");
      }
      return toast.error(err.message);
    }
  };

  useEffect(() => {
    if (showComments) {
      getAllComments();
    }
  }, [showComments]);
  return {
    comments,
    setComments,
    showComments,
    setshowComments,
    addComment,
  };
}

//Don't just directly expose our setState method outside of this function, instead if u want to setState outside
//too , use the method showed in the video of Codesen solutions or expose some functions outside,that indirectly
//triggers the setState method present in this function.

export default useComment;
