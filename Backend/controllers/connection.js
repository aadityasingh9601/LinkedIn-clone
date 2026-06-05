import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Connection from "../models/Connection.js";
import { io, userSocketMap } from "../server.js";
import Notification from "../models/Notification.js";

const checkConnection = async (req, res) => {
  const { userId } = req.params;
  const connection = await Connection.find({
    $and: [
      { user: { $in: [req.user._id, userId] } },
      { connectedUser: { $in: [userId, req.user._id] } },
    ],
  });
  if (connection.length > 0) {
    res.send("yes");
  } else {
    res.send("no");
  }
};

const sendConnRequest = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  const currUser = await User.findById(req.user._id);
  const connection = await Connection.findOne({
    $and: [
      { user: { $in: [req.user._id, userId] } },
      { connectedUser: { $in: [userId, req.user._id] } },
    ],
  });
  //If already connected
  if (connection) {
    return res
      .status(400)
      .json({ message: "You are already connected to this user!" });
  }
  //Check if connection request already sent.
  const notification = await Notification.findOne({
    sender: req.user._id,
    recipient: userId,
    type: "connection",
  });
  if (notification) {
    return res.status(400).json({
      message: "Connection request already sent!",
    });
  }
  const message = `${currUser.name} would like to connect with you!`;
  //Save the notification in database.
  const newNotification = new Notification({
    recipient: userId,
    message: message,
    sender: req.user._id,
    type: "connection",
  });
  await newNotification.save();
  //Emit socket event for real-time notification.
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit("connReq", newNotification);
  }

  res.status(200).send({ message: "Connection request sent successfully!" });
};

const respondToConnRequest = async (req, res) => {
  const { userId } = req.params;
  const { response, notiId } = req.body;
  const user = await Profile.findOne({ userId: userId });
  const currUser = await Profile.findOne({ userId: req.user._id });
  if (response === "Accept") {
    //First delete the old notification , means I have sent conn request to someone then a notification must be
    //sent to them, but after they reply with accept or reject , that particular notification must gets deleted
    //from the database, as it has served it's purpose and not it's of no use.

    await Notification.findByIdAndDelete(notiId);

    const newConnection = new Connection({
      user: userId,
      connectedUser: req.user._id,
    });

    await newConnection.save();
    user.connCount += 1;
    await user.save();
    currUser.connCount += 1;
    await currUser.save();
  }
  if (response === "Reject") {
    //Delete the old notification first.
    await Notification.findByIdAndDelete(notiId);
  }

  const Msg = `${currUser.name} has ${response}ed your connection request.`;

  //Save the notification in database first.
  const newNotification = new Notification({
    recipient: userId,
    message: Msg,
    sender: req.user._id,
    type: "response",
  });
  await newNotification.save();

  //Emit socket event for real-time notification.
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit("connReq", newNotification);
  }
  res.status(200).send({ user1: userId, user2: req.user._id });
};

const getAllConnections = async (req, res) => {
  const { userId } = req.params;
  //Check if the user trying to see the connections is connected to the user.
  const isConnected = await Connection.find({
    $and: [
      { user: { $in: [req.user._id, userId] } },
      { connectedUser: { $in: [userId, req.user._id] } },
    ],
  });
  if (req.user._id.toString() === userId.toString() || isConnected.length > 0) {
    const connections = await Connection.find({
      $or: [{ user: userId }, { connectedUser: userId }],
    }).populate({
      path: "connectedUser user",
      select: "profile",
      populate: {
        path: "profile",
        select: "headline name profileImage",
      },
    });
    res.status(200).send(connections);
  } else {
    res.status(404).send({
      message:
        "You can't see the connections of this account, as you are not connected to them.",
    });
  }
};

const removeConnection = async (req, res) => {
  const { userId } = req.params;
  const connection = await Connection.findOne({
    $and: [
      { user: { $in: [req.user._id, userId] } },
      { connectedUser: { $in: [userId, req.user._id] } },
    ],
  });
  if (!connection) {
    res.status(404).send({ message: "Connection not found!" });
    return;
  }

  await connection.deleteOne();
  const user1 = await Profile.findOne({ userId: connection.user });
  user1.connCount -= 1;
  await user1.save();

  const user2 = await Profile.findOne({ userId: connection.connectedUser });
  user2.connCount -= 1;
  await user2.save();
  res
    .status(200)
    .send({ deletedId: connection._id, user1: userId, user2: req.user._id });
};

export default {
  checkConnection,
  sendConnRequest,
  respondToConnRequest,
  getAllConnections,
  removeConnection,
};
