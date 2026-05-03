import "./MsgBox.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../shared-components/Buttons/Button";
import EmojiPicker from "emoji-picker-react";
import Xmark from "../shared-components/Icons/Xmark";
import SmileS from "../shared-components/Icons/SmileS";
import SmileR from "../shared-components/Icons/SmileR";
import Paperclip from "../shared-components/Icons/Paperclip";
import ControlledTextarea from "../shared-components/Textarea/ControlledTextarea";
import ControlledInput from "../shared-components/Inputs/ControlledInput";

export default function MsgBox({ currChatId, socket }) {
  const sendMsg = useChatStore((state) => state.sendMsg);
  const [newMsg, setnewMsg] = useState("");

  const [emojiPicker, setemojiPicker] = useState(false);

  const [fileName, setFileName] = useState("");

  const [mediaFile, setmediaFile] = useState("");

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
        <ControlledTextarea
          placeholder="Write a message"
          value={newMsg}
          styles={{
            maxHeight: "4.5rem",
            width: "22rem",
            margin: "0.3rem 0 0 0",
            backgroundColor: "#f4f2ee",
          }}
          onChange={handleChange}
        />

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
              <SmileS onClick={() => setemojiPicker(false)} />
            ) : (
              <SmileR onClick={() => setemojiPicker(true)} />
            )}
          </div>

          <div className="icon">
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <Paperclip />
            </label>
            <ControlledInput
              id="file-upload"
              type="file"
              styles={{ display: "none" }}
              onChange={(e) => {
                setFileName(e.target.files[0]?.name || "");
                setmediaFile(e.target.files[0]);
              }}
            />

            {fileName && (
              <>
                <div>{fileName}</div>
                <Xmark
                  onClick={() => {
                    setFileName("");
                    setmediaFile("");
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
