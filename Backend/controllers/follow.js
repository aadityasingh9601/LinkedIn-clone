import Profile from "../models/Profile.js";
import Follow from "../models/Follow.js";

//To check if the current logged in user has followed a certain user or not.
const checkFollow = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const follow = await Follow.findOne({
    user: req.user._id,
    userFollowed: userId,
  });

  if (follow) {
    res.status(200).send("yes");
  } else {
    res.status(200).send("no");
  }
};

const follow = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  console.log(req.user._id);
  console.log("inside follow");
  const userProfile = await Profile.findOne({ userId: userId });
  const follow = await Follow.findOne({
    user: req.user._id,
    userFollowed: userId,
  });
  if (req.user._id.toString() === userId) {
    res.status(400).send({ message: "You can't follow yourself!" });
    return;
  }
  if (follow) {
    res.status(400).send({ message: "You are already following this user." });
  } else {
    const newFollow = new Follow({
      user: req.user._id,
      userFollowed: userId,
    });
    await newFollow.save();
    userProfile.followerCount++;
    await userProfile.save();
    res.status(200).send({ message: "User followed successfully" });
  }
};

//Done by the user who has followed initially.
const unfollow = async (req, res) => {
  console.log("inside unfollow");
  const { userId } = req.params;
  console.log(userId);
  const userProfile = await Profile.findOne({ userId: userId });
  const follow = await Follow.findOne({
    user: req.user._id,
    userFollowed: userId,
  });
  if (!follow) {
    res.status(400).send({ message: "You are not following this user." });
    return;
  } else {
    await follow.deleteOne();
    userProfile.followerCount--;
    await userProfile.save();
    res.status(200).send({ deletedId: follow._id });
  }
};

//Done by the user who is being followed.
const removeFollower = async (req, res) => {
  console.log("inside removeFollower");
  const { followerId } = req.params;
  console.log(followerId);
  const userProfile = await Profile.findOne({ userId: req.user._id });

  const follow = await Follow.findOne({
    user: followerId,
    userFollowed: req.user._id,
  });

  if (!follow) {
    res
      .status(400)
      .send({ message: "This user is not following you in the first place." });
    return;
  } else {
    await follow.deleteOne();
    userProfile.followerCount--;
    await userProfile.save();
    res.status(200).send({ deletedId: follow._id });
  }
};

const allFollowers = async (req, res) => {
  console.log("inside all followers");
  const userId = req.user._id;
  console.log(userId);
  const followers = await Follow.find({ userFollowed: userId }).populate({
    path: "user",
    select: "profile",
    populate: {
      path: "profile",
      select: "name headline profileImage",
    },
  });
  //console.log(followers);
  res.status(200).send(followers);
};

const allFollowing = async (req, res) => {
  console.log("Inside all following");
  const userId = req.user._id;
  //console.log(userId);
  const following = await Follow.find({ user: userId }).populate({
    path: "userFollowed",
    select: "profile",
    populate: {
      path: "profile",
      select: "name headline profileImage",
    },
  });
  //console.log(following);
  res.status(200).send(following);
};

export default {
  follow,
  checkFollow,
  unfollow,
  removeFollower,
  allFollowers,
  allFollowing,
};
