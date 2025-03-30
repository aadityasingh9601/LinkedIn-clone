import Post from "../models/Post.js";
import Group from "../models/Group.js";
import { postSchema } from "../schema.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  const { postData } = req.body;
  console.log(postData);
  console.log(req.file);
  let type = req.file ? req.file.mimetype.split("/")[0] : "";
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  const { error } = postSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(404).send({ error: error });
    return;
  }

  const newPost = new Post({
    content: postData.content,
    media: {
      mediaType: type,
      url: url,
      filename: filename,
    },
    createdBy: req.user._id,
    postType: postData.postType,
    category: postData.category,
  });

  await newPost.save();
  let fullPost = await Post.findById(newPost._id).populate({
    path: "createdBy",
    select: "profile",
    populate: {
      path: "profile",
      select: "name profileImage headline",
    },
  });
  console.log(fullPost);
  res.status(201).send(fullPost);
};

const allPosts = async (req, res) => {
  const { userId } = req.params;

  const page = parseInt(req.query.page) || 1;
  console.log("55", page);
  // const skip = (page - 1) * limit;
  const skip = (page - 1) * 2;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "createdBy",
      select: "profile", // Include only the `profile` field in `createdBy`
      populate: {
        path: "profile", // Populate the `profile` field
        select: "headline name profileImage", // Include only `headline` and `name` fields in the `profile`
      },
    })
    .skip(skip) //It'll skip the first "skip" no. of posts and send from the further data.
    .limit(2); //Limits to only 2 posts at a time.

  //What we have to do here is to populate the post's createdBy field with the user field and the user's
  // profileId field with name, profileImg and headline. So, we have to use nested populate here.
  //
  for (let post of posts) {
    console.log("Post Id:-" + post._id);
  }

  res.status(200).send(posts);
};

const singlePost = async (req, res) => {
  const { userId } = req.params;
  const post = await Post.findById(userId);
  res.status(200).send(post);
};

const updatePost = async (req, res) => {
  const { postId } = req.params;

  const { postData } = req.body;
  console.log(postData);
  console.log(req.file);

  const { error } = postSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(404).send({ error: error });
    return;
  }

  const post = await Post.findByIdAndUpdate(postId, { ...req.body.postData });
  //Check if the user trying to update is the owner of the post.
  if (req.user._id.toString() === post.createdBy.toString()) {
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

      //Then save the new media details in the database.

      let type = req.file.mimetype.split("/")[0];
      console.log(type);

      post.media.mediaType = type;
      post.media.url = req.file.path;
      post.media.filename = req.file.filename;
      await post.save();
    }

    //Everything is fine here, but there's just one small problem you edited a post, uploaded a new media, but
    //what about the old image on the cloud it's still there , it's not deleted from there & still consuming
    //memory so ,that needs to be deleted , even u have changed the url of the file and all in the database, that
    //fine , but u need to remove the old image from the cloud storage also. So do that.

    res.status(200).send({ message: "Post updated successfully", post });
  } else {
    res.status(401).send({ message: "You are not the owner of this post." });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  //We have used findByIdAndDelete in order to trigger the mongoose middleware that will delete all the comments
  //associated with the post.
  if (req.user._id.toString() === post.createdBy.toString()) {
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

    await Post.findByIdAndDelete(postId);

    if (post.groupId) {
      const group = await Group.findByIdAndUpdate(post.groupId, {
        $pull: { posts: postId },
      });
    }
    res.status(200).send({ message: "Post deleted successfully" });
  } else {
    res.status(401).send({ message: "You are not the owner of the post." });
  }
};

export default {
  createPost,
  allPosts,
  singlePost,
  updatePost,
  deletePost,
};
