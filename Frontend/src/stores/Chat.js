import { create } from "zustand";
import { toast } from "react-toastify";
import {
  tryCatchWrapper,
  apiDelete,
  apiGet,
  apiPost,
  apiPatch,
} from "../utils/helper";

const useChatStore = create((set, get) => ({
  chatData: {},

  messages: [],

  fullChat: false,

  currChatId: localStorage.getItem("currChatId") || "",

  chats: [],

  newChatUser: null,

  setfullChat: (value, chatId) => {
    localStorage.setItem("currChatId", chatId || "");
    set({ currChatId: chatId || "" });
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

  handleMessage: async (profileId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/checkchat/${profileId}`);
      if (response.data.exists) {
        set({ newChatUser: null });
        get().setfullChat(true, response.data.chatId);
        get().getChatData(response.data.chatId);
        get().getAllMsg(response.data.chatId);
      } else {
        set({
          fullChat: true,
          currChatId: "",
          newChatUser: profileId,
          messages: [],
          chatData: {},
        });
        localStorage.setItem("currChatId", "");
      }
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

  sendMsg: async (chatId, data) => {
    tryCatchWrapper(async () => {
      const { newChatUser } = get();
      let targetChatId = chatId;

      if (!chatId && newChatUser) {
        const createResp = await apiPost(
          `/chat/createchat/${newChatUser}`,
          {},
          {},
        );
        targetChatId = createResp.data.chatId;
        set({ newChatUser: null, currChatId: targetChatId });
        localStorage.setItem("currChatId", targetChatId);
      }

      await apiPost(
        `/chat/${targetChatId}`,
        { data },
        { "Content-Type": "multipart/form-data" },
      );
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
      return toast.success("Msg updated succesfully!");
    });
  },

  deleteMsg: async (msgId) => {
    tryCatchWrapper(async () => {
      const response = await apiDelete(`/chat/message/${msgId}`);
      return toast.success("Msg deleted successfully!");
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
