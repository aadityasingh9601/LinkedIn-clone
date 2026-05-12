import Post from "../models/Post.js";
import Like from "../models/Like.js";

const likePost = async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  //Checking if the user has already liked the post or not, if liked we have to stop them from liking again.
  //const like = await Like.findOne({ postId: id } && { userId: req.user._id });
  //Writing this way was incorrect, this was causing the problem, why? See in your notes or chatGPt.

  const like = await Like.findOne({ postId: postId, user: req.user._id });

  if (like) {
    res.status(400).send({ message: "You have already liked this post." });
    //Redirect to the unlike post route if they have already like the post.
    return;
  } else {
    const newLike = new Like({
      postId: postId,
      user: req.user._id,
    });

    await newLike.save();
    console.log(newLike);
    const post = await Post.findById(postId);
    post.likeCount += 1;
    await post.save();
    console.log(post.likeCount);
    res.status(200).send({ message: "Like saved successfully" });
  }
};

const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const like = await Like.findOneAndDelete(
    { postId: postId },
    { user: req.user._id }
  );
  console.log(like);
  const post = await Post.findById(postId);
  post.likeCount -= 1;
  await post.save();
  console.log(post.likeCount);
  res.status(201).send({ message: "Like deleted successfully" });
};

const getAllLikes = async (req, res) => {
  const { postId } = req.params;
  const likes = await Like.find({ postId: postId }, { user: 1 }).populate(
    "user",
    "name profileImage headline"
  );
  console.log(likes);
  res.status(200).send(likes);
};

const checkLike = async (req, res) => {
  const { postId } = req.params;
  const like = await Like.findOne({ postId: postId, user: req.user._id });
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
