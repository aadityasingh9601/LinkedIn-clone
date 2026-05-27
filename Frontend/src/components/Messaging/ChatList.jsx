import styles from "./ChatList.module.css";
import Chat from "./Chat";
import useUserStore from "../../stores/User";
import useChatStore from "../../stores/Chat";

export default function ChatList({ socket }) {
  const { currUserId, currUserProfile } = useUserStore((s) => ({
    currUserId: s.currUserId,
    currUserProfile: s.currUserProfile,
  }));
  const { chats, getAllChats } = useChatStore((s) => ({
    chats: s.chats,
    getAllChats: s.getAllChats,
  }));
  console.log(currUserProfile);

  return (
    <div>
      {currUserProfile?.chatList.map((chat) => {
        return <Chat chat={chat} key={chat._id} socket={socket} />;
      })}
    </div>
  );
}
