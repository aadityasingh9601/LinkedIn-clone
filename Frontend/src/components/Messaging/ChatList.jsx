import styles from "./ChatList.module.css";
import Chat from "./Chat";
import useUserStore from "../../stores/User";
import useChatStore from "../../stores/Chat";

export default function ChatList({ socket }) {
  const currUserId = useUserStore((s) => s.currUserId);
  const currUserProfile = useUserStore((s) => s.currUserProfile);
  const chats = useChatStore((s) => s.chats);
  const getAllChats = useChatStore((s) => s.getAllChats);
  console.log(currUserProfile);

  return (
    <div>
      {currUserProfile?.chatList.map((chat) => {
        return <Chat chat={chat} key={chat._id} socket={socket} />;
      })}
    </div>
  );
}
