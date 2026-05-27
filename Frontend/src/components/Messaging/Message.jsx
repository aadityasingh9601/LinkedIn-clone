import styles from "./Message.module.css";
import { useState } from "react";
import Button from "../shared-components/Buttons/Button";
import useChatStore from "../../stores/Chat";
import ExternalLink from "../shared-components/Links/ExternalLink";
import Options from "../shared-components/Options/Options";
import Modal from "../shared-components/Modal/Modal";
import DeleteModal from "../shared-components/Modal/DeleteModal";
import ControlledInput from "../shared-components/Inputs/ControlledInput";
import useUserStore from "../../stores/User";
import UserAvatar from "../shared-components/User/UserAvatar";

export default function Message({ msg, formatTime }) {
  const [showOptions, setShowOptions] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newMsg, setnewMsg] = useState(msg?.content);
  const [editMsg, setEditMsg] = useState(false);
  const currUserId = useUserStore((state) => state.currUserId);
  const updateMsg = useChatStore((s) => s.updateMsg);
  const deleteMsg = useChatStore((s) => s.deleteMsg);

  const timePassed = (new Date() - new Date(msg.createdAt)) / 60000;

  return (
    <div key={msg?._id} className={styles.msg}>
      <div className={styles.msgInfo}>
        <div className={styles.sender}>
          <UserAvatar
            url={msg?.sender?.profile?.profileImage?.url}
            customStyles={{ height: "2rem", width: "2rem" }}
          />
          <div className="name">
            {currUserId === msg?.sender._id ? "You" : msg?.sender?.profile.name}
          </div>
          <div className={styles.time}>{formatTime(msg?.createdAt)}</div>
        </div>
        <div>
          {currUserId === msg?.sender._id && timePassed < 60 && (
            <Options
              show={showOptions}
              setShow={setShowOptions}
              setEdit={setEditMsg}
              setDelete={setDeleteModal}
            />
          )}
        </div>
      </div>

      {editMsg ? (
        <div className={styles.msgEditForm}>
          <ControlledInput
            value={newMsg}
            onChange={(e) => {
              setnewMsg(e.target.value);
            }}
          />

          <div className={styles.buttonWrapper}>
            <Button
            variant="xs"
            btnText="Cancel"
            onClick={() => setEditMsg(false)}
          />
          <Button
            variant="xs"
            btnText="Save Changes"
            onClick={() => {
              updateMsg({ msgId: msg._id, newMsg: newMsg });
              setEditMsg(false);
            }}
          />
          </div>
        </div>
      ) : (
        <div className={styles.msgText}>{msg?.content}</div>
      )}

      {msg?.media?.mediaType === "application" && (
        <ExternalLink href={msg?.media?.url}>Go to pdf</ExternalLink>
      )}

      {msg?.media?.mediaType === "image" && (
        <img
          src={msg?.media?.url}
          style={{
            height: "20rem",
            width: "20rem",
            border: "1px solid black",
            marginTop: "1.5rem",
            borderRadius: "0.5rem",
          }}
        />
      )}

      {msg?.media?.mediaType === "video" && (
        <video
          controls
          src={msg?.media?.url}
          style={{
            height: "20rem",
            width: "20rem",
            border: "1px solid black",
            marginTop: "1.5rem",
            borderRadius: "0.5rem",
          }}
        />
      )}

      {deleteModal && (
        <Modal>
          <DeleteModal
            handleCancel={setDeleteModal}
            handleDelete={() => {
              deleteMsg(msg._id);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
