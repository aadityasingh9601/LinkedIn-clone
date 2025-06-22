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

  currChatId: localStorage.getItem("currChatId"),

  chats: [],

  setfullChat: (value, chatId) => {
    localStorage.setItem("currChatId", chatId);
    set({ currChatId: chatId }); //Make sure to update the state variable also, else UI won't b re-rendered!
    set({ fullChat: value });
  },

  handleMessage: async (profileId) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/chat/createchat/${profileId}`, {}, {});
      console.log(response);
      get().setfullChat(true, response.data.chatId);

      fetchAllMsg(response.data.chatId);
      //Emit socket event to join the user in the currChatId room.
      socket.emit("join-room", response.data.chatId);
    });
  },

  fetchChatData: async (chatId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/getchat/${chatId}`);
      set({ chatData: response.data });
    });
  },

  getAllChats: async (userId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/getallchats/${userId}`);
      set({ chats: response.data });
    });
  },

  addMessage: (newMessage) => {
    console.log(newMessage);
    set((state) => ({
      messages: [...state.messages, newMessage], // Add the new message
    }));
  },

  updateLastMsg: (data) => {
    console.log(data);
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === data.chatId ? { ...chat, lastMessage: data } : chat
      ),
    }));
  },

  editMessage: (data) => {
    console.log(data);
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === data.msgId ? data.updatedMessage : msg
      ),
    }));
  },

  removeMessage: (msgId) => {
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== msgId),
    }));

    //We'll not return our toast message here,cause the event will happen in both users, even for user
    //who hasn't done anything.That's why shift these toast messages to our functions that handle backend response.
    // return toast.success("Msg deleted successfully!");
  },

  sendMsg: async (chatId, data) => {
    tryCatchWrapper(async () => {
      const response = await apiPost(`/chat/${chatId}`, { data }, {});
      console.log(response);
    });
  },

  fetchAllMsg: async (chatId) => {
    tryCatchWrapper(async () => {
      const response = await apiGet(`/chat/${chatId}`);
      set({ messages: response.data });
    });
  },

  updateMsg: async (data) => {
    let msgId = data.msgId;
    let newContent = data.newMsg;
    tryCatchWrapper(async () => {
      const response = await apiPatch(
        `/chat/message/${msgId}`,
        { newContent },
        {}
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

      if (response.status === 403)
        return toast.warn("You can't delete this chat!");
    });
  },
}));

export default useChatStore;
