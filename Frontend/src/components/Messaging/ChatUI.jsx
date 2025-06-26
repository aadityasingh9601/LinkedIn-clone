import { useState, useEffect, useRef } from "react";
import "./ChatUI.css";
import MsgBox from "./MsgBox";

import useChatStore from "../../stores/Chat";
import Message from "./Message";
import Xmark from "../../icons/Xmark";
import User from "../User";
import { formatDate2 } from "../../utils/helper";

export default function ChatUI({ socket }) {
  const currChatId = useChatStore((state) => state.currChatId);
  const currUserId = localStorage.getItem("currUserId");

  const fetchChatData = useChatStore((state) => state.fetchChatData);

  const messages = useChatStore((state) => state.messages);

  const fetchAllMsg = useChatStore((state) => state.fetchAllMsg);

  const chatData = useChatStore((state) => state.chatData);

  const setfullChat = useChatStore((state) => state.setfullChat);

  const chatContainerRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", currChatId);
    fetchChatData(currChatId);
    fetchAllMsg(currChatId);
  }, [currChatId]);

  const otherPerson = chatData?.participants?.find(
    (participant) => participant._id !== currUserId
  );

  function formatTime(time) {
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

    return formattedTime;
  }

  let lastDate = null;

  return (
    <div className="chatui">
      <div className="receiver">
        <Xmark
          onClick={() => setfullChat(false)}
          styles={{
            zIndex: "30",
            top: "0.5rem",
            right: "0.5rem",
          }}
        />

        <User
          userId={otherPerson?.profile.userId}
          username={otherPerson?.profile.name}
          url={otherPerson?.profile.profileImage?.url}
          headline={otherPerson?.profile.headline}
        />
      </div>

      <div className="allMsg" ref={chatContainerRef}>
        {messages?.map((msg) => {
          const messageDate = formatDate2(msg?.Date);
          const isNewDay = lastDate !== messageDate;
          lastDate = messageDate;
          return (
            <>
              {isNewDay && <div className="date-divider">{messageDate}</div>}
              <Message msg={msg} formatTime={formatTime} />
            </>
          );
        })}
      </div>
      <MsgBox currChatId={currChatId} socket={socket} />
    </div>
  );
}
