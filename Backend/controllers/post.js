import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";
import { PostDataSchema } from "../zodSchema/index.js";

const createPost = async (req, res) => {
  const { postData } = req.body;
  const result = PostDataSchema.safeParse(postData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const { date, time } = postData;
  let scheduledTime = "";
  if (date && time) {
    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");
    const utcTimestamp = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
    );
    scheduledTime = new Date(utcTimestamp - 5.5 * 60 * 60 * 1000); //convert to IST
  }
  let type = req.file ? req.file.mimetype.split("/")[0] : "";
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  const newPost = new Post({
    content: postData.content,
    media: {
      mediaType: type,
      url: url,
      filename: filename,
    },
    author: req.user._id,
    scheduledTime: scheduledTime,
    postType: postData.postType,
    published: scheduledTime instanceof Date ? false : true,
  });

  await newPost.save();

  let fullPost = await Post.findById(newPost._id).populate({
    path: "author",
    select: "profile",
    populate: {
      path: "profile",
      select: "name profileImage headline",
    },
  });
  res.status(201).send(fullPost);
};

const getPosts = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * 2;
  //Update this logic later to show only selective posts based on user's connections etc.
  const posts = await Post.find({ published: true, postType: "Everyone" })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "profile",
      populate: {
        path: "profile",
        select: "headline name profileImage",
      },
    })
    .skip(skip) //It'll skip the first "skip" no. of posts and send from the further data.
    .limit(10); //Limits to only 10 posts at a time.

  res.status(200).send(posts);
};

const allScheduledPosts = async (req, res) => {
  const { userId } = req.params;
  const schPosts = await Post.find({
    published: false,
    scheduledTime: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "profile",
      populate: {
        path: "profile",
        select: "headline name profileImage",
      },
    });
  res.status(200).send(schPosts);
};

const singlePost = async (req, res) => {
  const { userId } = req.params;
  const post = await Post.findById(userId);
  res.status(200).send(post);
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { postData } = req.body;
  const result = PostDataSchema.safeParse(postData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }
  const { date, time } = postData;
  let scheduledAt = "";
  if (date && time) {
    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");
    const utcTimestamp = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
    );
    scheduledAt = new Date(utcTimestamp - 5.5 * 60 * 60 * 1000);
  }

  const { error } = postSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(404).send({ error: error });
    return;
  }

  const post = await Post.findByIdAndUpdate(postId, {
    ...req.body.postData,
    scheduledTime: scheduledAt,
  });
  //Check if the user trying to update is the owner of the post.
  if (req.user._id.toString() === post.author.toString()) {
    // Update the image url only when some new image is available.

    if (typeof req.file !== "undefined") {
      //First delete the old media file.

      if (post.media.mediaType === "image") {
        await cloudinary.uploader
          .destroy(post.media.filename, { resource_type: "image" })
          .then((result) => console.log(result));
      }

      if (post.media.mediaType === "video") {
        await cloudinary.uploader
          .destroy(post.media.filename, { resource_type: "video" })
          .then((result) => console.log(result));
      }

      let type = req.file.mimetype.split("/")[0];
      post.media.mediaType = type;
      post.media.url = req.file.path;
      post.media.filename = req.file.filename;
      await post.save();
    }

    //Everything is fine here, but there's just one small problem you edited a post, uploaded a new media, but
    //what about the old image on the cloud it's still there , it's not deleted from there & still consuming
    //memory so ,that needs to be deleted , even u have changed the url of the file and all in the database, that
    //fine , but u need to remove the old image from the cloud storage also. So do that.
    const updatedPost = await Post.findById(postId);

    res.status(200).send({ message: "Post updated successfully", updatedPost });
  } else {
    res.status(401).send({ message: "You are not the owner of this post." });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (req.user._id.toString() === post?.author.toString()) {
    if (post.media.mediaType === "image") {
      await cloudinary.uploader
        .destroy(post.media.filename, { resource_type: "image" })
        .then((result) => console.log(result));
    }
    if (post.media.mediaType === "video") {
      await cloudinary.uploader
        .destroy(post.media.filename, { resource_type: "video" })
        .then((result) => console.log(result));
    }
    //We have used findByIdAndDelete in order to trigger the mongoose middleware that will delete all the comments
    //associated with the post.
    await Post.findByIdAndDelete(postId);
    res.status(200).send({ message: "Post deleted successfully" });
  } else {
    res.status(401).send({ message: "You are not the owner of the post." });
  }
};

export default {
  createPost,
  getPosts,
  allScheduledPosts,
  singlePost,
  updatePost,
  deletePost,
};
