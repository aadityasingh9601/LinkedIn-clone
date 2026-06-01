import Navbar from "./Navbar";
import styles from "./Layout.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../../../stores/User";
import ChatUI from "../../Messaging/ChatUI";
import useChatStore from "../../../stores/Chat";
import ChatList from "../../Messaging/ChatList";
import { useEffect, useState } from "react";
import CaretUp from "../../shared-components/Icons/CaretUp";
import UserAvatarIcon from "../Icons/UserAvatarIcon";
import { size } from "lodash";

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

      <div
        className={`${styles.messaging} ${isMessagingOpen ? styles.expanded : styles.collapsed}`}
      >
        <div className={styles.top}>
          <div className={styles.a}>
            <div>
              <UserAvatarIcon styles={{ fontSize: "2rem", color: "#666666" }} />
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
            <ChatList socket={socket} />
          </div>
        )}
        {fullChat && <ChatUI socket={socket} />}
      </div>

      <main>{children}</main>
    </>
  );
}

export default Layout;
