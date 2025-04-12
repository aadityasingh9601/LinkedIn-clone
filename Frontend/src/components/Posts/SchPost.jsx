import { useState } from "react";
import "./SchPost.css";
import Button from "../Button.";
import usePostStore from "../../stores/Post";
import PostEditForm from "./PostEditForm";
import Modal from "../Modal";

export default function SchPost({ schPost }) {
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const hours = date.getHours().toString().padStart(2, "0"); //padStart 2 to ensure numbers are atleast two
    const minutes = date.getMinutes().toString().padStart(2, "0"); //digits long by adding leading zeroes.

    return `${formattedDate.replace(",", "")} at ${hours}:${minutes}`;
  }

  //console.log(schPost);
  const [editModal, seteditModal] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const [options, setOptions] = useState(false);
  return (
    <div className="schPost">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "95%",
          color: "#555555",
          margin: "0 0 0.7rem 0",
        }}
      >
        <div>{formatDate(schPost?.scheduledTime)}</div>
        <div>
          <i
            class="fa-solid fa-ellipsis"
            onClick={() => setOptions(!options)}
            style={{ fontSize: "1rem" }}
          ></i>
        </div>
      </div>
      <div>{schPost?.content.substring(0, 50)}...</div>
      {options && (
        <div className="options-box">
          <Button btnText="Edit post" onClick={() => seteditModal(true)} />
          <Button
            btnText="Delete post"
            onClick={() => deletePost(schPost._id)}
          />
        </div>
      )}

      {editModal && (
        <Modal>
          <i
            class="fa-solid fa-xmark cross"
            onClick={() => seteditModal(false)}
          ></i>
          <PostEditForm post={schPost} />
        </Modal>
      )}
    </div>
  );
}
