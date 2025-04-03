import "./ChatList.css";
import Chat from "./Chat";
import useUserStore from "../../stores/User";

export default function ChatList({ chats, socket }) {
  const currUserId = useUserStore((state) => state.currUserId);
  return (
    <div>
      {chats.map((chat) => {
        const otherPerson = chat?.participants?.find(
          (participant) => participant._id !== currUserId
        );

        return (
          <Chat
            chat={chat}
            key={chat._id}
            otherPerson={otherPerson}
            socket={socket}
          />
        );
      })}
    </div>
  );
}
