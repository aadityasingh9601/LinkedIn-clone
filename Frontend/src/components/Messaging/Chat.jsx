import styles from "./Chat.module.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../shared-components/Buttons/Button";
import Ellipsis from "../shared-components/Icons/Ellipsis";
import Xmark from "../shared-components/Icons/Xmark";
import { formatTime, formatDate2 } from "../../utils/helper";
import useUserStore from "../../stores/User";
import UserAvatar from "../shared-components/User/UserAvatar";

export default function Chat({ chat }) {
  const currUserId = useUserStore((state) => state.currUserId);
  console.log(chat);
  const otherPerson = chat?.participants?.find(
    (participant) => participant._id !== currUserId,
  );
  console.log(otherPerson);

  const setfullChat = useChatStore((state) => state.setfullChat);
  const deleteChat = useChatStore((state) => state.deleteChat);

  let Time = formatTime(
    chat?.lastMessage ? chat?.lastMessage?.createdAt : new Date(),
  );
  let chatDate = formatDate2(
    chat?.lastMessage ? chat?.lastMessage?.createdAt : new Date(),
  );
  let currDate = formatDate2(new Date());

  const isNewDay = currDate !== chatDate;
  const [chatOptions, setchatOptions] = useState(false);
  const [removeChat, setremoveChat] = useState(false);

  return (
    <>
      <div
        className={styles.chat}
        onClick={() => {
          setfullChat(true, chat);
        }}
      >
        <div className={styles.chatInfo}>
          <UserAvatar
            url={otherPerson?.profile.profileImage?.url}
            customStyles={{ height: "3rem", width: "3rem" }}
          />
          <div>
            <div className={styles.name}>{otherPerson?.profile.name}</div>
            <div className={styles.lastMsg}>
              {chat?.lastMessage?.sender._id === currUserId
                ? `You: ${chat?.lastMessage?.content}`
                : chat?.lastMessage?.content}
            </div>
          </div>
        </div>

        <div className={styles.options}>
          <div className={styles.datetime}>
            {isNewDay ? chatDate.split(",")[1] : Time}
          </div>
          <div>
            <Ellipsis onClick={() => setchatOptions(!chatOptions)} />

            {chatOptions && (
              <div className={styles.chatOptions}>
                <Button
                  variant="sm"
                  btnText="Delete"
                  onClick={() => deleteChat(chat._id)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
