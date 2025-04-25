import Post from "../models/Post.js";
import Like from "../models/Like.js";

const likePost = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  //Checking if the user has already liked the post or not, if liked we have to stop them from liking again.
  //const like = await Like.findOne({ postId: id } && { userId: req.user._id });
  //Writing this way was incorrect, this was causing the problem, why? See in your notes or chatGPt.

  const like = await Like.findOne({ postId: id, user: req.user._id });

  if (like) {
    res.status(400).send({ message: "You have already liked this post." });
    //Redirect to the unlike post route if they have already like the post.
    return;
  } else {
    const newLike = new Like({
      postId: id,
      user: req.user._id,
    });

    await newLike.save();
    console.log(newLike);
    const post = await Post.findById(id);
    post.likeCount += 1;
    await post.save();
    console.log(post.likeCount);
    res.status(200).send({ message: "Like saved successfully" });
  }
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const like = await Like.findOneAndDelete(
    { postId: id },
    { user: req.user._id }
  );
  console.log(like);
  const post = await Post.findById(id);
  post.likeCount -= 1;
  await post.save();
  console.log(post.likeCount);
  res.status(201).send({ message: "Like deleted successfully" });
};

const getAllLikes = async (req, res) => {
  const { id } = req.params;
  const likes = await Like.find({ postId: id }, { user: 1 }).populate(
    "user",
    "name profileImage headline"
  );
  console.log(likes);
  res.status(200).send(likes);
};

const checkLike = async (req, res) => {
  const { id } = req.params;
  const like = await Like.findOne({ postId: id, user: req.user._id });
  if (like) {
    res.send("yes");
  } else {
    res.send("no");
  }
};

export default {
  likePost,
  unlikePost,
  getAllLikes,
  checkLike,
};
