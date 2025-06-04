import "./Chat.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../Button.";

export default function Chat({ chat, otherPerson, socket }) {
  const currUserId = localStorage.getItem("currUserId");

  const fullChat = useChatStore((state) => state.fullChat);

  const setfullChat = useChatStore((state) => state.setfullChat);

  const deleteChat = useChatStore((state) => state.deleteChat);

  const formatTime = (time) => {
    // Convert the string into a Date object
    const date = new Date(time);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12

    // Format the minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Combine the results
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
    //console.log(formattedTime);
    return formattedTime;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // E.g., "Wednesday, January 22, 2025"
  };

  let Time = formatTime(chat?.lastMessage?.Date);
  let chatDate = formatDate(chat?.lastMessage?.Date);
  let currDate = formatDate(new Date());

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
        <i
          class="fa-solid fa-ellipsis"
          onClick={() => setchatOptions(true)}
        ></i>
        {chatOptions && (
          <div className="chatOptions">
            <i
              class="fa-solid fa-xmark"
              onClick={() => setchatOptions(false)}
              style={{ position: "absolute", top: "0.3rem", right: "0.3rem" }}
            ></i>

            <Button btnText="Delete" onClick={() => deleteChat(chat._id)} />
          </div>
        )}
      </div>
    </>
  );
}
