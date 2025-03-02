import "./MsgBox.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../Button.";
import EmojiPicker from "emoji-picker-react";

export default function MsgBox({ currChatId, socket }) {
  const sendMsg = useChatStore((state) => state.sendMsg);
  const [newMsg, setnewMsg] = useState("");

  const [emojiPicker, setemojiPicker] = useState(false);

  const [fileName, setFileName] = useState("");

  const [mediaFile, setmediaFile] = useState("");

  const handleChange2 = (e) => {
    setFileName(e.target.files[0]?.name || "");
    setmediaFile(e.target.files[0]);
  };

  function handleChange(event) {
    setnewMsg(event.target.value);
  }

  function handleEmojiClick(emojiObject) {
    console.log(emojiObject);
    setnewMsg((prev) => prev + emojiObject.emoji);
  }

  return (
    <div className="msgbox">
      {emojiPicker && (
        <div className="emoji">
          <EmojiPicker
            height={350}
            width={300}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <textarea
          placeholder="Write a message"
          value={newMsg}
          onChange={handleChange}
        ></textarea>

        <Button
          btnText="Send"
          onClick={() => {
            sendMsg(currChatId, { newMsg, mediaFile });
            setFileName("");
            setmediaFile("");
            setnewMsg("");

            socket.emit("newMsg", newMsg);
          }}
        />
      </div>
      <div className="extras">
        <div className="icons">
          <div className="icon">
            {emojiPicker ? (
              <i
                className="fa-solid fa-face-smile"
                onClick={() => setemojiPicker(false)}
              ></i>
            ) : (
              <i
                className="fa-regular fa-face-smile"
                onClick={() => setemojiPicker(true)}
              ></i>
            )}
          </div>

          <div className="icon">
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <i className="fa-solid fa-paperclip"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleChange2}
            />

            {fileName && (
              <>
                <div>{fileName}</div>
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => {
                    setFileName("");
                    setmediaFile("");
                  }}
                ></i>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
