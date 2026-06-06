import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import Profile from "../../models/Profile.js";
import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Job from "../../models/Job.js";
import Application from "../../models/Application.js";
import Message from "../../models/Message.js";
import Chat from "../../models/Chat.js";
import Analytic from "../../models/Analytics.js";
import Notification from "../../models/Notification.js";
import Poll from "../../models/Poll.js";
import Connection from "../../models/Connection.js";
import Follow from "../../models/Follow.js";

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27018/LinkedIn")
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error(err));

const createObjectId = () => new mongoose.Types.ObjectId();

// USERS & PROFILES
const userIds = [
  createObjectId(),
  createObjectId(),
  createObjectId(),
  createObjectId(),
];
const profileIds = [
  createObjectId(),
  createObjectId(),
  createObjectId(),
  createObjectId(),
];

const users = [
  {
    _id: userIds[0],
    name: "Aaditya",
    email: "aaditya@example.com",
    password: "Password123",
    signupDate: new Date("2024-01-15"),
    refreshTokens: [],
    profile: profileIds[0],
  },
  {
    _id: userIds[1],
    name: "Jane Doe",
    email: "jane@example.com",
    password: "Password123",
    signupDate: new Date("2024-02-10"),
    refreshTokens: [],
    profile: profileIds[1],
  },
  {
    _id: userIds[2],
    name: "John Smith",
    email: "john@example.com",
    password: "Password123",
    signupDate: new Date("2024-03-05"),
    refreshTokens: [],
    profile: profileIds[2],
  },
  {
    _id: userIds[3],
    name: "Demo User",
    email: "abc@gmail.com",
    password: "123456",
    signupDate: new Date("2024-04-20"),
    refreshTokens: [],
    profile: profileIds[3],
  },
];

const profiles = [
  {
    _id: profileIds[0],
    userId: userIds[0],
    name: "Aaditya",
    profileImage: {
      filename: "avatar_aaditya",
      url: "https://i.pravatar.cc/150?img=3",
    },
    bannerImage: {
      filename: "banner_aaditya",
      url: "https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180",
    },
    headline: "Software Engineer",
    about: "Building scalable web apps with React and Node.js.",
    contactInfo: { phone: 1234567890, email: "aaditya@example.com" },
    location: "Delhi India",
    skills: ["JavaScript", "React", "NodeJS"],
    education: [
      {
        institution: "IIT Delhi",
        degree: "B.Tech",
        description:
          "Studied Computer Science with focus on distributed systems and web technologies.",
        started: new Date(2018, 7, 1),
        ended: new Date(2022, 5, 30),
      },
    ],
    experience: [
      {
        jobTitle: "Software Developer",
        companyName: "Tech Solutions",
        started: new Date(2022, 6, 1),
        ended: new Date(2024, 11, 31),
        description:
          "Built and maintained full-stack web applications serving 10k plus users using React and Node.js.",
      },
    ],
    followerCount: 2,
    connectionCount: 2,
    chatList: [],
    myJobs: { saved: [], applied: [] },
    myGroups: [],
  },
  {
    _id: profileIds[1],
    userId: userIds[1],
    name: "Jane Doe",
    profileImage: {
      filename: "avatar_jane",
      url: "https://i.pravatar.cc/150?img=4",
    },
    bannerImage: {
      filename: "banner_jane",
      url: "https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180",
    },
    headline: "Frontend Developer",
    about: "React and UI/UX enthusiast passionate about accessible design.",
    contactInfo: { phone: 1234567891, email: "jane@example.com" },
    location: "Mumbai India",
    skills: ["React", "CSS", "TypeScript"],
    education: [
      {
        institution: "IIT Bombay",
        degree: "B.Tech",
        description:
          "Specialised in Human-Computer Interaction and frontend engineering during my undergraduate studies.",
        started: new Date(2017, 7, 1),
        ended: new Date(2021, 5, 30),
      },
    ],
    experience: [
      {
        jobTitle: "Frontend Developer",
        companyName: "Webify",
        started: new Date(2021, 6, 1),
        ended: new Date(2024, 10, 15),
        description:
          "Led migration of legacy jQuery UI to React with 40 percent improvement in render performance.",
      },
    ],
    followerCount: 1,
    connectionCount: 2,
    chatList: [],
    myJobs: { saved: [], applied: [] },
    myGroups: [],
  },
  {
    _id: profileIds[2],
    userId: userIds[2],
    name: "John Smith",
    profileImage: {
      filename: "avatar_john",
      url: "https://i.pravatar.cc/150?img=5",
    },
    bannerImage: {
      filename: "banner_john",
      url: "https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180",
    },
    headline: "Backend Developer",
    about: "Node.js and MongoDB specialist building scalable APIs.",
    contactInfo: { phone: 1234567892, email: "john@example.com" },
    location: "Bangalore India",
    skills: ["NodeJS", "MongoDB", "Express"],
    education: [
      {
        institution: "IIT Madras",
        degree: "B.Tech",
        description:
          "Focused on database systems, API design, and cloud infrastructure during my degree program.",
        started: new Date(2016, 7, 1),
        ended: new Date(2020, 5, 30),
      },
    ],
    experience: [
      {
        jobTitle: "Backend Developer",
        companyName: "API Corp",
        started: new Date(2020, 6, 1),
        ended: new Date(2024, 8, 30),
        description:
          "Designed and deployed RESTful microservices handling 1 million plus requests daily.",
      },
    ],
    followerCount: 1,
    connectionCount: 2,
    chatList: [],
    myJobs: { saved: [], applied: [] },
    myGroups: [],
  },
  {
    _id: profileIds[3],
    userId: userIds[3],
    name: "Demo User",
    profileImage: {
      filename: "avatar_demo",
      url: "https://i.pravatar.cc/150?img=6",
    },
    bannerImage: {
      filename: "banner_demo",
      url: "https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180",
    },
    headline: "Demo Account",
    about: "This is a demo user for testing the LinkedIn clone application.",
    contactInfo: { phone: 1234567893, email: "abc@gmail.com" },
    location: "Demo City",
    skills: ["Testing", "DemoDev"],
    education: [
      {
        institution: "Demo University",
        degree: "B.Tech",
        description:
          "A test institution used for demonstrating the education feature on this LinkedIn clone platform.",
        started: new Date(2015, 7, 1),
        ended: new Date(2019, 5, 30),
      },
    ],
    experience: [
      {
        jobTitle: "Demo Engineer",
        companyName: "Demo Corp",
        started: new Date(2019, 6, 1),
        ended: new Date(2024, 12, 31),
        description:
          "Responsible for testing all features of the LinkedIn clone application thoroughly end to end.",
      },
    ],
    followerCount: 0,
    connectionCount: 0,
    chatList: [],
    myJobs: { saved: [], applied: [] },
    myGroups: [],
  },
];

// POSTS
const postIds = [
  createObjectId(),
  createObjectId(),
  createObjectId(),
  createObjectId(),
];
const posts = [
  {
    _id: postIds[0],
    author: userIds[0],
    createdAt: new Date("2024-06-01"),
    content:
      "Excited to join LinkedIn Clone! Looking forward to connecting with everyone and sharing my journey in software development.",
    media: {
      mediaType: "image",
      url: "https://i.pravatar.cc/300",
      filename: "welcome_post",
    },
    published: true,
    postType: "Everyone",
    likeCount: 2,
    comments: [],
    scheduledTime: new Date("2024-06-01"),
  },
  {
    _id: postIds[1],
    author: userIds[1],
    createdAt: new Date("2024-06-05"),
    content:
      "Just published my first article on React best practices. Check it out and let me know your thoughts and feedback!",
    media: {},
    published: true,
    postType: "Everyone",
    likeCount: 1,
    comments: [],
    scheduledTime: new Date("2024-06-05"),
  },
  {
    _id: postIds[2],
    author: userIds[2],
    createdAt: new Date("2024-06-10"),
    content:
      "Here are some Node.js tips and tricks I have learned over the years that helped me write cleaner backend code and APIs.",
    media: {},
    published: true,
    postType: "Connections only",
    likeCount: 0,
    comments: [],
    scheduledTime: new Date("2024-06-10"),
  },
  {
    _id: postIds[3],
    author: userIds[3],
    createdAt: new Date("2024-06-15"),
    content:
      "This is a demo post from the demo user to test the post creation and display features on this platform.",
    media: {
      mediaType: "image",
      url: "https://i.pravatar.cc/300?img=6",
      filename: "demo_post",
    },
    published: true,
    postType: "Everyone",
    likeCount: 0,
    comments: [],
    scheduledTime: new Date("2024-06-15"),
  },
];

// COMMENTS
const commentIds = [createObjectId(), createObjectId(), createObjectId()];
const comments = [
  {
    _id: commentIds[0],
    postId: postIds[0],
    author: userIds[1],
    text: "Congrats Aaditya! Welcome to the platform!",
    createdAt: new Date("2024-06-01"),
  },
  {
    _id: commentIds[1],
    postId: postIds[1],
    author: userIds[2],
    text: "Great article Jane! Learned a ton from reading it.",
    createdAt: new Date("2024-06-05"),
  },
  {
    _id: commentIds[2],
    postId: postIds[3],
    author: userIds[3],
    text: "This is a comment from the demo user to test the comment feature thoroughly.",
    createdAt: new Date("2024-06-15"),
  },
];
posts[0].comments.push(commentIds[0]);
posts[1].comments.push(commentIds[1]);
posts[3].comments.push(commentIds[2]);

// LIKES
const likes = [
  { postId: postIds[0], user: userIds[1] },
  { postId: postIds[0], user: userIds[2] },
  { postId: postIds[1], user: userIds[0] },
  { postId: postIds[3], user: userIds[3] },
];

// JOBS
const jobIds = [createObjectId()];
const jobs = [
  {
    _id: jobIds[0],
    title: "Frontend Developer",
    company: "Tech Solutions",
    companyLogo:
      "https://tse4.mm.bing.net/th?id=OIP._pBOCluCuO5MXAp236xmhgHaHw&pid=Api&P=0&h=180",
    companyDescription:
      "Tech Solutions is a leading technology company specializing in building innovative web applications for enterprises across the globe.",
    location: "Remote India",
    jobDescription:
      "We are looking for a skilled Frontend Developer to work on cutting-edge React applications and collaborate with a talented team of engineers.",
    qualifications:
      "B.Tech or equivalent degree in Computer Science with at least 2 years of experience in React and modern JavaScript frameworks and libraries.",
    isOpen: true,
    skills: ["ReactJS", "JavaScript", "TypeScript"],
    salary: 80000,
    jobType: "Full-time",
    jobMode: "Remote",
    postedBy: userIds[0],
    postedDate: new Date("2024-06-01"),
    applications: [],
  },
];

// APPLICATIONS
const applicationIds = [createObjectId()];
const applications = [
  {
    _id: applicationIds[0],
    jobId: jobIds[0],
    applicant: userIds[1],
    answers: [
      "I have 3 years of experience building React applications and a strong passion for frontend development and UI design.",
    ],
    resume: { filename: "resume_jane.pdf", id: createObjectId() },
    status: "New",
    appliedAt: new Date("2024-06-10"),
  },
];
jobs[0].applications.push(applicationIds[0]);

// CHATS & MESSAGES
const chatIds = [createObjectId()];
const messageIds = [createObjectId(), createObjectId(), createObjectId()];
const chats = [
  {
    _id: chatIds[0],
    participants: [userIds[0], userIds[1]],
    createdAt: new Date("2024-06-01"),
    lastMessage: messageIds[1],
  },
];
const messages = [
  {
    _id: messageIds[0],
    chatId: chatIds[0],
    sender: userIds[0],
    content: "Hey Jane! How is the frontend project going?",
    media: {},
    createdAt: new Date("2024-06-01"),
  },
  {
    _id: messageIds[1],
    chatId: chatIds[0],
    sender: userIds[1],
    content: "Hi Aaditya! It is going great, almost done with the redesign.",
    media: {},
    createdAt: new Date("2024-06-01"),
  },
  {
    _id: messageIds[2],
    chatId: chatIds[0],
    sender: userIds[3],
    content: "Demo user says hello! Testing the messaging feature here.",
    media: {},
    createdAt: new Date("2024-06-15"),
  },
];

// ANALYTICS
const analytics = [
  {
    user: userIds[0],
    triggeredBy: userIds[1],
    date: new Date("2024-06-01"),
    eventType: "profile_view",
    metaData: { postId: postIds[0] },
  },
  {
    user: userIds[3],
    triggeredBy: userIds[0],
    date: new Date("2024-06-15"),
    eventType: "profile_view",
    metaData: { postId: postIds[3] },
  },
];

// NOTIFICATIONS
const notifications = [
  {
    recipient: userIds[0],
    message: "Jane Doe liked your post.",
    sender: userIds[1],
    type: "like",
    isRead: false,
    sentDate: new Date("2024-06-01"),
  },
  {
    recipient: userIds[3],
    message: "Welcome to the demo account!",
    sender: userIds[0],
    type: "response",
    isRead: false,
    sentDate: new Date("2024-06-15"),
  },
];

// POLLS
const pollIds = [createObjectId()];
const polls = [
  {
    _id: pollIds[0],
    question:
      "Which JS framework do you prefer for building modern web applications?",
    options: [
      { value: "React", votes: 2 },
      { value: "Vue", votes: 1 },
    ],
    voters: [
      { user: userIds[0], optionId: createObjectId() },
      { user: userIds[1], optionId: createObjectId() },
    ],
    expiresAt: new Date(Date.now() + 86400000),
    author: userIds[0],
    createdAt: new Date(),
  },
];

// CONNECTIONS & FOLLOWS
const connections = [
  {
    user: userIds[0],
    connectedUser: userIds[1],
    createdAt: new Date("2024-06-01"),
  },
  {
    user: userIds[1],
    connectedUser: userIds[2],
    createdAt: new Date("2024-06-02"),
  },
  {
    user: userIds[3],
    connectedUser: userIds[0],
    createdAt: new Date("2024-06-15"),
  },
];
const follows = [
  {
    user: userIds[0],
    userFollowed: userIds[2],
    createdAt: new Date("2024-06-01"),
  },
  {
    user: userIds[2],
    userFollowed: userIds[0],
    createdAt: new Date("2024-06-01"),
  },
  {
    user: userIds[3],
    userFollowed: userIds[1],
    createdAt: new Date("2024-06-15"),
  },
];

const init = async () => {
  try {
    // Hash passwords exactly as the signup controller does (bcrypt, 16 salt rounds)
    for (const user of users) {
      user.password = await bcrypt.hash(user.password, 16);
    }

    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Message.deleteMany({}),
      Chat.deleteMany({}),
      Analytic.deleteMany({}),
      Notification.deleteMany({}),
      Poll.deleteMany({}),
      Connection.deleteMany({}),
      Follow.deleteMany({}),
    ]);
    await User.insertMany(users);
    await Profile.insertMany(profiles);
    await Post.insertMany(posts);
    await Comment.insertMany(comments);
    await Like.insertMany(likes);
    await Job.insertMany(jobs);
    await Application.insertMany(applications);
    await Chat.insertMany(chats);
    await Message.insertMany(messages);
    await Analytic.insertMany(analytics);
    await Notification.insertMany(notifications);
    await Poll.insertMany(polls);
    await Connection.insertMany(connections);
    await Follow.insertMany(follows);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting mock data:", err);
    mongoose.disconnect();
  }
};

await init();
console.log("Database seeded successfully!");
