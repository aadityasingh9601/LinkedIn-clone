import "./Chat.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../Button.";
import Ellipsis from "../../icons/Ellipsis";
import Xmark from "../../icons/Xmark";
import { formatTime, formatDate2 } from "../../utils/helper";

export default function Chat({ chat, otherPerson, socket }) {
  const currUserId = localStorage.getItem("currUserId");

  const setfullChat = useChatStore((state) => state.setfullChat);

  const deleteChat = useChatStore((state) => state.deleteChat);

  let Time = formatTime(chat?.lastMessage?.Date);
  let chatDate = formatDate2(chat?.lastMessage?.Date);
  let currDate = formatDate2(new Date());

  const isNewDay = currDate !== chatDate;
  const [chatOptions, setchatOptions] = useState(false);
  const [removeChat, setremoveChat] = useState(false);

  return (
    <>
      <div
        className="chat"
        onClick={() => {
          setfullChat(true, chat._id);
        }}
      >
        <div className="a">
          <div>
            <img src={otherPerson?.profile.profileImage.url} />
          </div>
          <div>
            <span
              style={{
                margin: "0 0 1rem 0.4rem",
                fontSize: "1rem",
                display: "inline-block",
              }}
            >
              <b>{otherPerson.profile.name}</b>
            </span>
            <span
              style={{
                margin: "0 0 0 0.4rem",
                position: "absolute",
                right: "0.6rem",
                top: "0.35rem",
              }}
            >
              {isNewDay ? chatDate : Time}
            </span>
          </div>
        </div>
        <div
          className="b"
          style={{
            margin: "0 0 0 0.5rem",
            fontSize: "0.88rem",
          }}
        >
          {chat?.lastMessage?.sender === currUserId ||
          chat?.lastMessage?.sender._id === currUserId
            ? `You: ${chat?.lastMessage?.content}`
            : chat?.lastMessage?.content}
        </div>
        <Ellipsis onClick={() => setchatOptions(true)} />

        {chatOptions && (
          <div className="chatOptions">
            <Xmark
              onClick={() => setchatOptions(false)}
              styles={{ position: "absolute", top: "0.3rem", right: "0.3rem" }}
            />

            <Button btnText="Delete" onClick={() => deleteChat(chat._id)} />
          </div>
        )}
      </div>
    </>
  );
}
