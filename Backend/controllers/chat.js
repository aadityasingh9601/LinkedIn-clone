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
  const targetUser = await Profile.findOne({ userId: userId });
  const currUser = await Profile.findOne({ userId: currUserId });

  if (targetUser.userId.toString() === currUser.userId.toString()) {
    res.status(404).send({ message: "Cannot create a Chat with yourself." });
    return;
  }
  const existingChat = await Chat.findOne({
    participants: { $all: [currUser.userId, targetUser.userId] },
  });

  if (existingChat) {
    const chatMessages = await Message.find({ chatId: existingChat._id });
    //Emit the socket event to join the user into the socket room with current chatId.
    res.status(200).json({ chatId: existingChat._id, messages: chatMessages });
  } else {
    const chat = new Chat({
      participants: [currUser.userId, targetUser.userId],
    });
    await chat.save();
    console.log(chat);

    io.emit("join-room", chat._id);
    //console.log(currUser.chatList);
    targetUser.chatList.push(chat);
    currUser.chatList.push(chat);
    await targetUser.save();
    await currUser.save();
    res.status(200).json({ newChat: chat });
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
  const { userId } = req.params;
  console.log(req.params);
  const profile = await Profile.findOne({ userId: userId });

  const chats = await Chat.find({ _id: { $in: profile?.chatList } })
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
      select: "sender content createdAt",
    });

  console.log(chats);
  res.status(200).json({
    chats: chats,
  });
};

const createMessage = async (req, res) => {
  const { id } = req.params;
  let currUserId = req.user._id;
  let receiverId = id;
  const { data } = req.body;
  console.log(data);

  let existingChat = await Chat.findOne({
    participants: { $all: [currUserId, receiverId] },
  });

  let newChat = {};
  console.log(existingChat);
  //If there's no existing chat between the two users, first create chat.
  if (!existingChat) {
    newChat = new Chat({
      participants: [currUserId, receiverId],
    });
    await newChat.save();
    //Put the chatlist in both user's chatlist.
    const currUserProfile = await Profile.findOne({ userId: currUserId });
    const receiverUserProfile = await Profile.findOne({ userId: receiverId });
    currUserProfile.chatList.push(newChat._id);
    receiverUserProfile.chatList.push(newChat._id);
    await currUserProfile.save();
    await receiverUserProfile.save();
  }

  const chat = existingChat ? existingChat : newChat;

  console.log("Request file", req.file);
  let type = req.file ? req.file.mimetype.split("/")[0] : "";
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  const userProfile = await Profile.findOne({ userId: currUserId });
  //Check if the person trying to send message is a member of the chat.
  if (!chat.participants.includes(currUserId)) {
    return res.status(403).json({
      message: "Forbidden!",
    });
  }
  //If user's profile chatlist doesn't have the chat id, push it.
  if (!userProfile.chatList.includes(chat._id)) {
    userProfile.chatList.push(chat._id);
    await userProfile.save();
  }
  //Create the message.
  const newMessage = new Message({
    chatId: chat._id,
    sender: currUserId,
    content: data.message,
    media: {
      mediaType: type,
      url: url,
      filename: filename,
    },
  });
  await newMessage.save();
  chat.lastMessage = newMessage;
  await chat.save();
  //Emit socket event as the message gets saved in DB.
  const fullMessage = await newMessage.populate({
    path: "sender",
    select: "profile",
    populate: {
      path: "profile",
      select: "name headline profileImage",
    },
  });
  io.to(chat._id).emit("newMsg", fullMessage);
  //console.log(fullMessage);
  res.status(200).json({
    fullMessage: fullMessage,
  });
};

const getAllMsg = async (req, res) => {
  const { chatId } = req.params;
  console.log(chatId);
  const currUserId = req.user._id;

  const chat = await Chat.findById(chatId);

  if (chat) {
    if (!chat.participants.includes(currUserId)) {
      res.status(403).json({
        message: "Forbidden!",
      });
    }

    const messages = await Message.find({ chatId: chatId }).populate({
      path: "sender",
      select: "profile",
      populate: {
        path: "profile",
        select: "name profileImage",
      },
    });

    res.status(200).json({
      messages,
    });
  } else {
    res.status(404).send({ message: "Chat group not found" });
  }
};

const editMsg = async (req, res) => {
  const { msgId } = req.params;
  const { newContent } = req.body;
  const message = await Message.findById(msgId);
  const timePassed = (new Date() - message.createdAt) / 60000;

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
    res.status(403).send({ message: "Forbidden!" });
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
  createMessage,
  getSingleChat,
  getAllChats,
  getAllMsg,
  editMsg,
  deleteMsg,
  deleteChat,
};
