import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const useChatStore = create((set) => ({
  chatData: {},

  messages: [],

  fullChat: false,

  currChatId: localStorage.getItem("currChatId"),

  chats: [],

  setfullChat: (value, chatId) => {
    console.log("inside setfullChat function");
    localStorage.setItem("currChatId", chatId);
    set({ currChatId: chatId }); //Make sure to update the state variable also, else UI won't b re-rendered!
    set({ fullChat: value });
  },

  handleMessage: async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/chat/createchat/${currProfileId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setfullChat(true, response.data.chatId);

      fetchAllMsg(response.data.chatId);
      //Emit socket event to join the user in the currChatId room.
      socket.emit("join-room", response.data.chatId);
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  fetchChatData: async (chatId) => {
    //console.log(chatId);
    try {
      const response = await axios.get(
        `http://localhost:8000/chat/getchat/${chatId}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      set({ chatData: response.data });
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  getAllChats: async (userId) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:8000/chat/getallchats/${userId}`,
        {
          withCredentials: true,
        }
      );
      //console.log(response);
      set({ chats: response.data });
    } catch (e) {
      console.log(e.message);
      return toast.error(e.message);
    }
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
    console.log(data);
    try {
      const response = await axios.post(
        `http://localhost:8000/chat/${chatId}`,
        { data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      //console.log(response);
      //addMessage(response.data);
      //we don't need to update our state variable here, we can just update them in socket events.
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  },

  fetchAllMsg: async (chatId) => {
    console.log(chatId);
    try {
      const response = await axios.get(`http://localhost:8000/chat/${chatId}`, {
        withCredentials: true,
      });

      // console.log(response);
      set({ messages: response.data });
    } catch (e) {
      console.log(e);
      return toast.error(e);
    }
  },

  updateMsg: async (data) => {
    let msgId = data.msgId;
    let newContent = data.newMsg;
    try {
      const response = await axios.patch(
        `http://localhost:8000/chat/message/${msgId}`,
        { newContent },
        { withCredentials: true }
      );
      // console.log(response);
      return toast.success("Msg updated succesfully!");
      //Update the state variable in socket events.
    } catch (err) {
      console.log(err);
      return toast.error(err.message);
    }
  },

  deleteMsg: async (msgId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/chat/message/${msgId}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      return toast.success("Msg deleted successfully!");
      //Don't need to update our state variable here , we can just do that in socket events for real-time updates.
    } catch (err) {
      console.log(err);
    }
  },

  deleteChat: async (chatId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/chat/${chatId}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      if (response.status === 200) {
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== chatId),
        }));
        set({ fullChat: false });
        return toast.success("Chat deleted successfully!");
      }

      if (response.status === 403)
        return toast.warn("You can't delete this chat!");
    } catch (err) {
      console.log(err);
    }
  },
}));

export default useChatStore;
