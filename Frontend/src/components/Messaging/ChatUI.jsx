import { useState, useEffect, useRef } from "react";
import "./ChatUI.css";
import MsgBox from "./MsgBox";

import useChatStore from "../../stores/Chat";
import Message from "./Message";

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); // E.g., "Wednesday, January 22, 2025"
  };

  return (
    <div className="chatui">
      <i
        onClick={() => setfullChat(false)}
        className="fa-solid fa-xmark"
        style={{
          zIndex: "30",
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
        }}
      ></i>

      <div className="receiver">
        <div className="header">
          <div className="img">
            <img src={otherPerson?.profile.profileImage?.url} alt="" />
          </div>
          <div className="headline">
            <span>
              <b>{otherPerson?.profile.name}</b>
            </span>
            <br />
            <span
              style={{ fontSize: "0.85rem", color: "rgba(184, 17, 17, 0.65)" }}
            >
              {otherPerson?.profile.headline}
            </span>
            <br />
          </div>
        </div>
      </div>
      <div className="allMsg" ref={chatContainerRef}>
        {messages?.map((msg) => {
          const messageDate = formatDate(msg?.Date);
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
