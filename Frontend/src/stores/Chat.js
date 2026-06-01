import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
  safeParseJSON,
} from "../utils/helper";

const useChatStore = create((set, get) => ({
  currChatData: safeParseJSON("currChatData", {}),

  messages: [],

  fullChat: false,

  currChatId: safeParseJSON("currChatId", ""),

  chats: [],

  newChatUser: null,

  setfullChat: (value, chat) => {
    localStorage.setItem("currChatId", chat?._id || "");
    localStorage.setItem("currChatData", chat || {});
    set({ currChatId: chat?._id || "" });
    set({ currChatData: chat });
    set({ fullChat: value });
    if (!value) {
      set({ newChatUser: null });
    }
  },

  createChat: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/chat/createchat/${userId}`, {}, {});
      console.log(response);
    });
  },

  getChatData: async (chatId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/getchat/${chatId}`);
      set({ chatData: response.data });
    });
  },

  getAllChats: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/getallchats/${userId}`);
      set({ chats: response?.data?.chats });
    });
  },

  addMessage: (newMessage) => {
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateLastMsg: (data) => {
    console.log(data);
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === data.chatId ? { ...chat, lastMessage: data } : chat,
      ),
    }));
  },

  editMessage: (data) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === data.msgId ? data.updatedMessage : msg,
      ),
    }));
  },

  removeMessage: (msgId) => {
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== msgId),
    }));
  },

  sendMessage: async (receiverId, data) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(
        `/chat/${receiverId}`,
        { data },
        { "Content-Type": "multipart/form-data" },
      );
      //console.log(response);
    });
  },

  getAllMsg: async (chatId) => {
    tryCatchWrapper(async () => {
      if (!chatId) return;
      const response = await apiGet(`/chat/${chatId}`);
      set({ messages: response.data.messages });
    });
  },

  updateMsg: async (data) => {
    let msgId = data.msgId;
    let newContent = data.newMsg;
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/chat/message/${msgId}`,
        { newContent },
        {},
      );
      //Update state must be handled by socket events.
      return toast.success("Msg updated succesfully!");
    });
  },

  deleteMsg: async (msgId) => {
    tryCatchWrapper(async () => {
      await apiDelete(`/chat/message/${msgId}`);
      return toast.success("Success!");
    });
  },

  deleteChat: async (chatId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/chat/${chatId}`);
      if (response.status === 200) {
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== chatId),
        }));
        set({ fullChat: false });
        return toast.success("Chat deleted successfully!");
      }
    });
  },
}));

export default useChatStore;
