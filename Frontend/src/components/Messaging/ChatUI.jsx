import { useState, useEffect, useRef } from "react";
import styles from "./ChatUI.module.css";
import MsgBox from "./MsgBox";
import { formatTime } from "../../utils/helper";

import useChatStore from "../../stores/Chat";
import useProfileStore from "../../stores/Profile";
import Message from "../Messaging/Message";
import Xmark from "../shared-components/Icons/Xmark";
import UserInfo from "../shared-components/User/UserInfo";
import { formatDate2 } from "../../utils/helper";
import useUserStore from "../../stores/User";

export default function ChatUI({ socket }) {
  const currChatId = useChatStore((s) => s.currChatId);
  const currChatData = useChatStore((s) => s.currChatData);
  const getChatData = useChatStore((s) => s.getChatData);
  const messages = useChatStore((s) => s.messages);
  const getAllMsg = useChatStore((s) => s.getAllMsg);
  const setfullChat = useChatStore((s) => s.setfullChat);
  const currUserId = useUserStore((s) => s.currUserId);
  const currUserProfile = useUserStore((s) => s.currUserProfile);
  const profile = useProfileStore((state) => state.profile);
  const chatContainerRef = useRef(null);

  const profileData = {
    _id: profile?._id,
    name: profile?.name,
    headline: profile?.headline,
    profileImage: profile?.profileImage,
    userId: profile?.userId,
  };

  const existingChat = () => {
    for (let chat of currUserProfile?.chatList) {
      let success = [currUserId, profile?.userId].every((val) =>
        chat.participants.includes(val),
      );
      if (success) return chat;
    }
    return {};
  };

  const existingChatData = existingChat();

  const otherPerson = currChatData?.participants?.find(
    (participant) => participant._id !== currUserId,
  );

  const displayUser =
    typeof otherPerson !== "undefined" ? otherPerson?.profile : profileData;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currChatId) {
      socket?.emit("join-room", currChatId);
      getChatData(currChatId);
      getAllMsg(currChatId);
    }
  }, [currChatId]);

  let lastDate = null;

  return (
    <div className={styles.chatui}>
      <div className={styles.userInfo}>
        <Xmark
          onClick={() => {
            setfullChat(false, {});
          }}
          customStyles={{
            zIndex: "30",
            top: "0.5rem",
            right: "0.5rem",
          }}
        />

        <UserInfo
          profileId={displayUser?._id}
          username={displayUser?.name}
          url={displayUser?.profileImage?.url}
          headline={displayUser?.headline}
        />
      </div>
      <div className={styles.allMsg} ref={chatContainerRef}>
        {messages?.map((msg) => {
          const messageDate = formatDate2(msg?.createdAt);
          const isNewDay = lastDate !== messageDate;
          lastDate = messageDate;
          return (
            <div key={msg._id}>
              {isNewDay && (
                <div className={styles["date-divider"]}>{messageDate}</div>
              )}
              <Message msg={msg} formatTime={formatTime} />
            </div>
          );
        })}
      </div>
      <div>
        <MsgBox
          currChatId={currChatId}
          receiverId={displayUser?.userId}
          socket={socket}
        />
      </div>
    </div>
  );
}
