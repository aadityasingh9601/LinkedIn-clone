import "./Message.css";
import { useState } from "react";
import Button from "../Button.";
import useChatStore from "../../stores/Chat";
import ExternalLink from "../ExternalLink";

export default function Message({ msg, formatTime }) {
  const [msgOptions, setMsgOptions] = useState(false);
  const [newMsg, setnewMsg] = useState(msg?.content);
  const [editMsg, seteditMsg] = useState(false);
  const currUserId = localStorage.getItem("currUserId");
  const updateMsg = useChatStore((state) => state.updateMsg);
  const deleteMsg = useChatStore((state) => state.deleteMsg);

  const handleChange = (e) => {
    setnewMsg(e.target.value);
  };
  const timePassed = (new Date() - new Date(msg.Date)) / 60000;

  return (
    <div key={msg?._id} className="msg">
      <div className="sender">
        <div style={{ paddingRight: "2rem", display: "flex" }}>
          <div>
            <img src={msg?.sender.profile?.profileImage?.url} />
          </div>
          <div className="name">
            <b>
              {currUserId === msg.sender._id
                ? "You"
                : msg?.sender.profile?.name}
            </b>{" "}
          </div>

          <div className="time">{formatTime(msg?.Date)}</div>
        </div>
        {currUserId === msg?.sender._id && (
          <i
            class="fa-solid fa-ellipsis"
            style={{ position: "absolute", right: "0rem", top: "0rem" }}
            onClick={() => setMsgOptions(true)}
          ></i>
        )}
      </div>
      {editMsg ? (
        <>
          <input value={newMsg} onChange={handleChange} />

          <Button btnText="Cancel" onClick={() => seteditMsg(false)} />
          <Button
            btnText="Save Changes"
            onClick={() => {
              updateMsg({ msgId: msg._id, newMsg: newMsg });
              seteditMsg(false);
            }}
          />
        </>
      ) : (
        <div className="msgText">{msg?.content}</div>
      )}

      {msg?.media?.mediaType === "application" && (
        <ExternalLink href={msg?.media?.url}>Go to pdf</ExternalLink>
      )}

      {msg?.media?.mediaType === "image" && (
        <img
          src={msg?.media?.url}
          style={{
            height: "20rem",
            width: "20rem",
            border: "1px solid black",
            marginTop: "1.5rem",
            borderRadius: "0.5rem",
          }}
        />
      )}

      {msg?.media?.mediaType === "video" && (
        <video
          controls
          src={msg?.media?.url}
          style={{
            height: "20rem",
            width: "20rem",
            border: "1px solid black",
            marginTop: "1.5rem",
            borderRadius: "0.5rem",
          }}
        />
      )}

      {msgOptions && (
        <div className="msgOptions" onClick={() => setMsgOptions(false)}>
          <i
            class="fa-solid fa-xmark"
            style={{ position: "absolute", top: "0.3rem", right: "0.3rem" }}
          ></i>

          {timePassed < 60 && (
            <Button btnText="Edit" onClick={() => seteditMsg(true)} />
          )}
          <Button btnText="Delete" onClick={() => deleteMsg(msg._id)} />
        </div>
      )}
    </div>
  );
}
