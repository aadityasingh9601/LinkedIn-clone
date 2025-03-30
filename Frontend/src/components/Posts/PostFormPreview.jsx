import "./PostFormPreview.css";
import usePostStore from "../../stores/Post";

export default function PostFormPreview() {
  const postFormModal = usePostStore((state) => state.postFormModal);
  const setPostFormModal = usePostStore((state) => state.setPostFormModal);
  return (
    <div className="postformpreview">
      <div className="form">
        <div className="img">
          <img src="https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180" />
        </div>
        <div>
          <input
            placeholder="Start a post"
            onClick={() => setPostFormModal(true)}
          />
        </div>
      </div>
      <div className="icons">
        <div>
          <i class="fa-regular fa-image" style={{ color: "#0a66c2" }}></i>
          <span style={{ margin: "0 0 0 0.4rem" }}>Media</span>
        </div>
        <div>
          <i
            class="fa-solid fa-square-poll-vertical"
            style={{ color: "#c37d16" }}
          ></i>
          <span style={{ margin: "0 0 0 0.4rem" }}>Poll</span>
        </div>
      </div>
    </div>
  );
}
