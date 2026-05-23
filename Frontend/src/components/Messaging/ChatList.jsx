import styles from "./ChatList.module.css";
import Chat from "./Chat";
import useUserStore from "../../stores/User";
import useChatStore from "../../stores/Chat";

export default function ChatList({ socket }) {
  const currUserId = useUserStore((state) => state.currUserId);
  const chats = useChatStore((state) => state.chats);
  const currUserProfile = useUserStore((s) => s.currUserProfile);
  console.log(currUserProfile);
  const getAllChats = useChatStore((state) => state.getAllChats);

  return (
    <div>
      {currUserProfile?.chatList.map((chat) => {
        return <Chat chat={chat} key={chat._id} socket={socket} />;
      })}
    </div>
  );
}
