import styles from "./MsgBox.module.css";
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
import ImageIcon from "../shared-components/Icons/ImageIcon";

export default function MsgBox({ currChatId, receiverId, socket }) {
  const sendMessage = useChatStore((state) => state.sendMessage);
  const [newMsg, setnewMsg] = useState("");

  const [emojiPicker, setemojiPicker] = useState(false);

  const [fileName, setFileName] = useState("");

  const [mediaFile, setmediaFile] = useState("");

  function handleChange(event) {
    setnewMsg(event.target.value);
  }

  const handleSubmission = (event) => {
    event.preventDefault();
    sendMessage(receiverId, { message: newMsg, mediaFile });
    setFileName("");
    setmediaFile("");
    setnewMsg("");
  };

  function handleEmojiClick(emojiObject) {
    console.log(emojiObject);
    setnewMsg((prev) => prev + emojiObject.emoji);
  }

  return (
    <div className={styles.msgbox}>
      <div className={styles.msgForm}>
        <form id="msgform">
          <ControlledTextarea
            customClass={styles.msgFormTextarea}
            placeholder="Write a message"
            value={newMsg}
            onChange={handleChange}
          />
        </form>
      </div>

      <div className={styles.controls}>
        <div className={styles.icons}>
          <div className={styles.icon}>
            {emojiPicker ? (
              <SmileS onClick={() => setemojiPicker(false)} />
            ) : (
              <SmileR onClick={() => setemojiPicker(true)} />
            )}
            <div>
              {emojiPicker && (
                <div className={styles.emojiPicker}>
                  <EmojiPicker
                    height={350}
                    width={300}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.media}>
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <div className={styles.icon}>
                <ImageIcon />
              </div>
            </label>
            <div>
              <ControlledInput
                id="file-upload"
                type="file"
                customClass={styles.hidden}
                onChange={(e) => {
                  setFileName(e.target.files[0]?.name || "");
                  setmediaFile(e.target.files[0]);
                }}
              />
            </div>
            {fileName && (
              <div className={styles.filename}>
                <div>{fileName}</div>
                <div className={styles.xmark}>
                  <Xmark
                    onClick={() => {
                      setFileName("");
                      setmediaFile("");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            btnText="Send"
            form="msgform"
            variant="sm"
            type="submit"
            onClick={handleSubmission}
          />
        </div>
      </div>
    </div>
  );
}
