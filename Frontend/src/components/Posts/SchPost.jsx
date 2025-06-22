import { useState } from "react";
import "./SchPost.css";
import Button from "../Button.";
import usePostStore from "../../stores/Post";
import PostEditForm from "./PostEditForm";
import Modal from "../Modal";
import Ellipsis from "../../icons/Ellipsis";
import Xmark from "../../icons/Xmark";
import { formatDate2 } from "../../utils/helper";

export default function SchPost({ schPost }) {
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
        <div>{formatDate2(schPost?.scheduledTime)}</div>
        <div>
          <Ellipsis
            onClick={() => setOptions(!options)}
            style={{ fontSize: "1rem" }}
          />
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
          <Xmark onClick={() => seteditModal(false)} />
          <PostEditForm post={schPost} />
        </Modal>
      )}
    </div>
  );
}
