import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Message from "../models/Message.js";
import { io } from "../server.js";
import { v2 as cloudinary } from "cloudinary";

const createChat = async (req, res) => {
  console.log("inside createChat");
  const { userId } = req.params;
  console.log(userId);
  const currUserId = req.user._id;
  //First save the currUser's id in a variable only then use it , else mongoose will not include chatList in the
  //currUser, see the reason why_? in ChatGPT.
  const user = await Profile.findOne({ userId: userId });
  const currUser = await Profile.findOne({ userId: currUserId });

  if (user.userId.toString() === currUser.userId.toString()) {
    res.status(404).send({ message: "Cannot create a Chat with yourself." });
    return;
  }
  const existingChat = await Chat.findOne({
    participants: { $all: [currUser.userId, user.userId] },

    //$or: [{ participants: currUser._id }, { participants: user._id }], This is another way to doing that.
  });

  if (existingChat) {
    const chatMessages = await Message.find({ chatId: existingChat._id });

    //Emit the socket event to join the user into the socket room with current chatId.

    res.status(200).send({ chatId: existingChat._id, messages: chatMessages });
  } else {
    const chat = new Chat({
      participants: [currUser.userId, user.userId],
    });
    await chat.save();
    //console.log("Emitting join-room with chatId:");
    io.emit("join-room", chat._id);
    //console.log(currUser.chatList);
    user.chatList.push(chat);
    currUser.chatList.push(chat);
    await user.save();
    await currUser.save();
    // console.log("ChatID", chat._id);
    res.status(200).send({ chatId: chat._id });
  }
};

const getSingleChat = async (req, res) => {
  // console.log("getsingleChat");
  const { chatId } = req.params;
  // console.log(chatId);
  const chat = await Chat.findById(chatId).populate({
    path: "participants",
    select: "profile",
    populate: {
      path: "profile",
      select: "name headline profileImage",
    },
  });
  //console.log(chat);

  res.status(200).send(chat);
};

const getAllChats = async (req, res) => {
  // console.log("inside getAllChats");
  const { userId } = req.params;
  const profile = await Profile.findOne({ userId: userId });
  // console.log(profile.chatList);

  //when you query { participants: "userId" }, MongoDB scans the skills field (which is an array)
  // in each document to see if "MongoDB" is one of the values in that array.It's mongodb's default query behavior.

  //Here we are sending the chats, whose ids are present in the chatList of the user.
  const chats = await Chat.find({ _id: { $in: profile.chatList } })
    .populate({
      path: "participants",
      select: "profile",
      populate: {
        path: "profile",
        select: "profileImage name headline",
      },
    })
    .populate({
      path: "lastMessage",
      select: "sender content Date",
    });
  //console.log(chats);
  res.status(200).send(chats);
};

const createMsg = async (req, res) => {
  console.log("inside sendMsg");
  const { chatId } = req.params;
  // console.log(req.file);
  // console.log(chatId);
  const { data } = req.body;
  // console.log(data);

  let type = req.file ? req.file.mimetype.split("/")[0] : "";
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  const chat = await Chat.findById(chatId);
  const userProfile = await Profile.findOne({ userId: req.user._id });

  //Check if group exists and person trying to send message is a member of the chat group.
  if (chat) {
    //Check if the user's chatList has the chat in which msg is sent, because if a user deletes a chat, the
    //chat_id of that chat gets removed from the chatList of that user, but what if both of the users starts to
    //message again? in that case, we'll b needed to push the chat_id again into the chatList , so that it gets
    //displayed, whenever a new Msg comes.

    if (chat.participants.includes(req.user._id)) {
      if (!userProfile.chatList.includes(chat._id)) {
        userProfile.chatList.push(chat._id);
        await userProfile.save();
      }

      const newMessage = new Message({
        chatId: chatId,
        sender: req.user._id,
        content: data.newMsg,
        media: {
          mediaType: type,
          url: url,
          filename: filename,
        },
      });
      await newMessage.save();
      chat.lastMessage = newMessage;
      await chat.save();
      //Emit socket event as the newMsg gets saved.
      const fullMessage = await Message.findById(newMessage._id).populate({
        path: "sender",
        select: "profile",
        populate: {
          path: "profile",
          select: "name profileImage",
        },
      });
      io.to(chatId).emit("newMsg", fullMessage);
      res.status(200).send(fullMessage);
    } else {
      res.status(403).send({
        message: "You are unauthorized to send messages in this group.",
      });
    }
  } else {
    res.status(404).send({ message: "Chat group not found" });
    return;
  }
};

const getAllMsg = async (req, res) => {
  // console.log("inside getAllMsg");
  const { chatId } = req.params;
  // console.log(chatId);
  const currUserId = req.user._id;

  const chat = await Chat.findById(chatId);

  if (chat) {
    if (chat.participants.includes(currUserId)) {
      const messages = await Message.find({ chatId: chatId }).populate({
        path: "sender",
        select: "profile",
        populate: {
          path: "profile",
          select: "name profileImage",
        },
      });

      res.status(200).send(messages);
    } else {
      res.status(401).send({
        message: "You are unauthorized to view messages in this group.",
      });
    }
  } else {
    res.status(404).send({ message: "Chat group not found" });
  }
};

const editMsg = async (req, res) => {
  const { msgId } = req.params;
  const { newContent } = req.body;
  const message = await Message.findById(msgId);
  const timePassed = (new Date() - message.Date) / 60000;

  if (req.user._id.toString() === message.sender.toString()) {
    if (timePassed < 60) {
      message.content = newContent;
      await message.save();
      const updatedMessage = await Message.findById(msgId).populate({
        path: "sender",
        select: "profile",
        populate: {
          path: "profile",
          select: "name profileImage",
        },
      });
      let chatId = message.chatId.toString();
      io.to(chatId).emit("editMsg", {
        msgId,
        updatedMessage,
      });
      res.status(200).send(updatedMessage);
    } else {
      res.status(400).send({
        message: "You can't ediit message more than 60 minutes old!",
      });
    }
  } else {
    res.status(403).send({ message: "You can't delete this message" });
  }
};

const deleteMsg = async (req, res) => {
  const { msgId } = req.params;
  const message = await Message.findById(msgId);
  if (req.user._id.toString() === message.sender.toString()) {
    if (message.media.mediaType === "image") {
      await cloudinary.uploader
        .destroy(message.media.filename, { resource_type: "image" })
        .then((result) => console.log(result));
    }

    if (message.media.mediaType === "video") {
      await cloudinary.uploader
        .destroy(message.media.filename, { resource_type: "video" })
        .then((result) => console.log(result));
    }

    await message.deleteOne();
    //Emit socket event to add real-time changes to both participants.
    //Make sure to first convert the mongoDB id to string, else socket event will not get emitted.
    let chatId = message.chatId.toString();
    io.to(chatId).emit("deleteMsg", msgId);
    res.status(200).send({ message: "Message deleted successfully!" });
  } else {
    res.status(401).send({ message: "You are not the sender of this message" });
    return;
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  // console.log(chat);
  //Only members of a chat can delete it not anyone else.
  if (chat.participants.includes(req.user._id.toString())) {
    //First check if the chat has no participants, only then delete it, else delete it just for the one user.

    if (chat.participants.length === 1) {
      const deletedChat = await Chat.findByIdAndDelete(chatId);
      // console.log(deletedChat);
    } else {
      //Remove the chatId from the chatList of the user.
      const profile = await Profile.findOne({ userId: req.user._id });
      let idx = profile.chatList.indexOf(chatId);
      profile.chatList.splice(idx, 1);
      await profile.save();
    }
    res.status(200).send("Chat deleted successfully");
  } else {
    res.status(403).send("You can't delete this chat! ");
  }
};

export default {
  createChat,
  createMsg,
  getSingleChat,
  getAllChats,
  getAllMsg,
  editMsg,
  deleteMsg,
  deleteChat,
};
