import Navbar from "./Navbar";
import styles from "./Layout.module.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../../../stores/User";
import ChatUI from "../../Messaging/ChatUI";
import useChatStore from "../../../stores/Chat";
import ChatList from "../../Messaging/ChatList";
import { useEffect, useState } from "react";
import CaretUp from "../../shared-components/Icons/CaretUp";

function Layout({ children, socket }) {
  const fullChat = useChatStore((state) => state.fullChat);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const showMessaging = () => {
    setIsMessagingOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar showMessaging={showMessaging} />
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

      <div className={`${styles.messaging} ${isMessagingOpen ? styles.expanded : styles.collapsed}`}>
        <div className={styles.top}>
          <div className={styles.a}>
            <div>
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180"
                alt=""
              />
            </div>
            <div>Messaging</div>
          </div>
          <div className={styles.b}>
            <span className={isMessagingOpen ? styles.rotated : ""}>
              <CaretUp onClick={showMessaging} />
            </span>
          </div>
        </div>
        {isMessagingOpen && (
          <div className={styles.chats}>
            <ChatList />
          </div>
        )}
        {fullChat && <ChatUI socket={socket} />}
      </div>

      <main>{children}</main>
    </>
  );
}

export default Layout;
