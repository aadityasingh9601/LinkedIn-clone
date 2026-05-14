import { useState, useEffect, useRef } from "react";
import styles from "./ChatUI.module.css";
import MsgBox from "./MsgBox";
import { formatTime } from "../../utils/helper";

import useChatStore from "../../stores/Chat";
import Message from "../Messaging/Message";
import Xmark from "../shared-components/Icons/Xmark";
import UserInfo from "../shared-components/User/UserInfo";
import { formatDate2 } from "../../utils/helper";
import useUserStore from "../../stores/User";

export default function ChatUI({ socket }) {
  const currChatId = useChatStore((state) => state.currChatId);
  const currUserId = useUserStore((state) => state.currUserId);

  const getChatData = useChatStore((state) => state.getChatData);

  const messages = useChatStore((state) => state.messages);

  const getAllMsg = useChatStore((state) => state.getAllMsg);

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
    getChatData(currChatId);
    getAllMsg(currChatId);
  }, [currChatId]);

  const otherPerson = chatData?.participants?.find(
    (participant) => participant._id !== currUserId,
  );

  let lastDate = null;

  return (
    <div className={styles.chatui}>
      <div className={styles.receiver}>
        <Xmark
          onClick={() => setfullChat(false)}
          styles={{
            zIndex: "30",
            top: "0.5rem",
            right: "0.5rem",
          }}
        />

        <UserInfo
          userId={otherPerson?.profile.userId}
          username={otherPerson?.profile.name}
          url={otherPerson?.profile.profileImage?.url}
          headline={otherPerson?.profile.headline}
        />
      </div>

      <div className={styles.allMsg} ref={chatContainerRef}>
        {messages?.map((msg) => {
          const messageDate = formatDate2(msg?.Date);
          const isNewDay = lastDate !== messageDate;
          lastDate = messageDate;
          return (
            <>
              {isNewDay && (
                <div className={styles["date-divider"]}>{messageDate}</div>
              )}
              <Message msg={msg} formatTime={formatTime} />
            </>
          );
        })}
      </div>
      <MsgBox currChatId={currChatId} socket={socket} />
    </div>
  );
}
