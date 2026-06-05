import Chat from "./Chat";
import useUserStore from "../../stores/User";

export default function ChatList({ socket }) {
  const currUserProfile = useUserStore((s) => s.currUserProfile);

  return (
    <div>
      {currUserProfile?.chatList.map((chat) => {
        return <Chat chat={chat} key={chat._id} socket={socket} />;
      })}
    </div>
  );
}
