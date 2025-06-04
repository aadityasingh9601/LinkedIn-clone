import Navbar from "./Navbar"; // Your navigation bar component
import { ToastContainer } from "react-toastify";
import ChatUI from "./Messaging/ChatUI";
import useChatStore from "../stores/Chat";
import ChatList from "./Messaging/ChatList";
import { useEffect } from "react";

function Layout({ children, socket }) {
  const currUserId = localStorage.getItem("currUserId");

  const chats = useChatStore((state) => state.chats);
  const getAllChats = useChatStore((state) => state.getAllChats);
  const fullChat = useChatStore((state) => state.fullChat);

  useEffect(() => {
    getAllChats(currUserId);
  }, [currUserId]);

  const showMessaging = () => {
    let messaging = document.querySelector(".messaging");
    messaging.classList.toggle("position");

    let icon = document.querySelector(".upicon");
    icon.classList.toggle("rotate");
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />

      <div className="messaging position">
        <div className="top">
          <div className="a">
            <div>
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180"
                alt=""
              />
            </div>

            <div>Messaging</div>
          </div>
          <div className="b">
            <i class="fa-solid fa-ellipsis"></i>
            <i
              class="fa-solid fa-caret-up upicon"
              onClick={() => showMessaging()}
            ></i>
          </div>
        </div>
        <div className="chats remove">
          <ChatList chats={chats} socket={socket} />
        </div>
        {fullChat && <ChatUI socket={socket} />}
      </div>

      <main>{children}</main>
    </>
  );
}

export default Layout;
