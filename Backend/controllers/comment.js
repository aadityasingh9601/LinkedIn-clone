import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const newComment = new Comment({
    postId: postId,
    author: req.user._id,
    text: comment.comment,
  });
  await newComment.save();
  const post = await Post.findById(postId);
  post.comments.push(newComment);
  await post.save();

  const fullComment = await Comment.findById(newComment._id).populate({
    path: "author",
    select: "profile",
    populate: {
      path: "profile",
      select: "name headline profileImage",
    },
  });
  //We have to do these changes here because now we have separate models for our users and profiles.
  res.status(201).send(fullComment);
};

const getComments = async (req, res) => {
  console.log("inside get comments");
  const { postId } = req.params;
  console.log(postId);
  const comments = await Comment.find({ postId: postId }).populate({
    path: "author",
    select: "profile",
    populate: { path: "profile", select: "headline name profileImage" },
  });

  res.status(200).send(comments);
};

const updateComment = async (req, res) => {
  console.log("inside updatecomment");
  const { commentId } = req.params;
  const { newComment } = req.body;

  const comment = await Comment.findById(commentId);
  //Check if the author of the comment is trying to update the comment , not any intruder.
  if (comment.author.toString() === req.user._id.toString()) {
    comment.text = newComment;
    await comment.save();
    res.status(200).send(newComment);
  } else {
    res
      .status(401)
      .send({ message: "You are not the author of this comment." });
  }
};

const deleteComment = async (req, res) => {
  const {commentId } = req.params;
  const comment = await Comment.findById(commentId);
  //const post = await Post.findById(comment.postId);
  if (comment.author.toString() === req.user._id.toString()) {
    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: {
        comments: commentId,
      },
    });

    res.status(200).send({ message: "Comment deleted successfully!" });
  } else {
    res.status(403).send({ message: "You are not the author of this comment" });
  }
};

export default {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
