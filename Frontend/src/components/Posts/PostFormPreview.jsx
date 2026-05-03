import "./PostFormPreview.css";
import usePostStore from "../../stores/Post";
import ImageIcon from "../shared-components/Icons/ImageIcon";
import Pollicon from "../shared-components/Icons/PollIcon";
import ControlledInput from "../shared-components/Inputs/ControlledInput";

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
          <ControlledInput
            placeholder="Start a post"
            onClick={() => setPostFormModal(true)}
          />
        </div>
      </div>
      <div className="icons">
        <div>
          <ImageIcon styles={{ color: "#0a66c2" }} />
          <span style={{ margin: "0 0 0 0.4rem" }}>Media</span>
        </div>
        <div>
          <Pollicon styles={{ color: "#c37d16" }} />

          <span style={{ margin: "0 0 0 0.4rem" }}>Poll</span>
        </div>
      </div>
    </div>
  );
}
