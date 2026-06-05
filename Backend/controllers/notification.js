import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id });
  res.status(200).json({
    notifications:notifications
  })
};

const markAsRead = async (req, res) => {
  const notifications = await Notification.updateMany(
    { recipient: req.user._id },
    { isRead: true }
  );

  res.status(200).json({
    message:"Mark as done!"
  })
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
