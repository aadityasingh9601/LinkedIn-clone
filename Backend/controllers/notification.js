import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id });
  //console.log(notifications);
  res.status(200).send(notifications);
};
//We can also transform this getNotifications route to make it something like , a request comes , server checks who is sending the request
//from req.user._id and returns the notifications related to that user.Because , the way we write the path previously didn't actually provided
//that much protection as we thought it would , because ultimately if someone gets the token of someone else, so they would be able to access
//that user's notifications, id, userdata,etc.

const markAsRead = async (req, res) => {
  console.log(req.user._id);
  //Find notifications of the currUser only.
  const notifications = await Notification.updateMany(
    { recipient: req.user._id },
    { isRead: true }
  );

  console.log(notifications);

  res.status(200).send("Mark as done!");
};

const deleteNotifications = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (req.user._id.toString() === notification.recipient.toString()) {
    await notification.deleteOne();
    res.status(200).send({ message: "Notification deleted successfully!" });
  } else {
    res.status(403).send({ message: "You can't delete this notification!" });
  }
};

const deleteGroupNotifications = async (req, res) => {
  console.log("received@");
  const { id } = req.params;
  const notification = await Notification.findById(id);
  //We also have to delete the other notifications sent to other admins after one admin has resolved the
  //notification.

  if (req.user._id.toString() === notification.recipient.toString()) {
    await notification.deleteOne();
    await Notification.deleteMany({ message: notification.message });
    res.status(200).send({ message: "Notification deleted successfully!" });
  } else {
    res.status(403).send({ message: "You can't delete this notification!" });
  }
};

export default {
  getNotifications,
  markAsRead,
  deleteNotifications,
  deleteGroupNotifications,
};
