import styles from "./Chat.module.css";
import useChatStore from "../../stores/Chat";
import { useState } from "react";
import Button from "../shared-components/Buttons/Button";
import Ellipsis from "../shared-components/Icons/Ellipsis";
import Xmark from "../shared-components/Icons/Xmark";
import { formatTime, formatDate2 } from "../../utils/helper";
import useUserStore from "../../stores/User";
import UserAvatar from "../shared-components/User/UserAvatar";

export default function Chat({ chat, otherPerson }) {
  console.log(chat,otherPerson);
  const currUserId = useUserStore((state) => state.currUserId);
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
          setfullChat(true, chat._id);
        }}
      >
        <div>
          <UserAvatar
            url={otherPerson?.profileImage?.url}
            customStyles={{ height: "3rem", width: "3rem" }}
          />
        </div>
        <div>
          <div>{otherPerson.name}</div>
          <div className="lastMsg">
            {chat?.lastMessage?.sender._id === currUserId
              ? `You: ${chat?.lastMessage?.content}`
              : chat?.lastMessage?.content}
          </div>
        </div>
        <div>
          <div className={styles.time}>{isNewDay ? chatDate : Time}</div>
          <div>
            <Ellipsis onClick={() => setchatOptions(true)} />

            {chatOptions && (
              <div className={styles.chatOptions}>
                <Xmark
                  onClick={() => setchatOptions(false)}
                />
                <Button btnText="Delete" onClick={() => deleteChat(chat._id)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
