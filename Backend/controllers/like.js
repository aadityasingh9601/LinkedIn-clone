import Post from "../models/Post.js";
import Like from "../models/Like.js";

const likePost = async (req, res) => {
  const { postId } = req.params;
  const like = await Like.findOne({ postId: postId, user: req.user._id });
  if (like) {
    return res.status(400).json({
      message: "You have already liked this post!",
    });
  }
  const newLike = new Like({
    postId: postId,
    user: req.user._id,
  });
  await newLike.save();
  const post = await Post.findById(postId);
  post.likeCount += 1;
  await post.save();
  res.status(200).json({ message: "Success!" });
};

const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const existingLike = await Like.findOne({
    postId: postId,
    user: req.user._id,
  });
  if (!existingLike) {
    return res.status(400).json({
      message: "You haven't liked this post yet!",
    });
  }

  await Like.findOneAndDelete({ postId: postId }, { user: req.user._id });

  const post = await Post.findById(postId);
  post.likeCount -= 1;
  await post.save();
  res.status(200).json({
    message: "Success!",
  });
};

const getAllLikes = async (req, res) => {
  const { postId } = req.params;
  const likes = await Like.find({ postId: postId }, { user: 1 }).populate({
    path: "user",
    select: "profile",
    populate: {
      path: "profile",
      select: "name profileImage headline",
    },
  });
  res.status(200).json({
    likes: likes,
  });
};

export default {
  likePost,
  unlikePost,
  getAllLikes,
};
