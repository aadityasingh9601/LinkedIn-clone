import { io, userSocketMap } from "../server.js";
import cron from "node-cron";
import Post from "../models/Post.js";

export const startPostPublishScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const posts = await Post.find({
      published: false,
      scheduledTime: { $lte: new Date() },
    });
    for (const post of posts) {
      post.published = true;
      await post.save();

      let fullPost = await Post.findById(post._id).populate({
        path: "author",
        select: "profile",
        populate: {
          path: "profile",
          select: "name profileImage headline",
        },
      });
      //Emit a socket event here to update state on the frontend.
      const socketId = userSocketMap[post.author._id.toString()];
      io.to(socketId).emit("post_created", fullPost);
    }
  });
};
