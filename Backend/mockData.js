// Demo login user:
// Email: abc@gmail.com
// Password: 123

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Like from './models/Like.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Message from './models/Message.js';
import Chat from './models/Chat.js';
import Analytic from './models/Analytics.js';
import Notification from './models/Notification.js';
import Poll from './models/Poll.js';
import Connection from './models/Connection.js';
import Follow from './models/Follow.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error(err));

const createObjectId = () => new mongoose.Types.ObjectId();

// USERS & PROFILES (relationally linked)
const userIds = [createObjectId(), createObjectId(), createObjectId(), createObjectId()];
const profileIds = [createObjectId(), createObjectId(), createObjectId(), createObjectId()];

const users = [
  { _id: userIds[0], name: 'Aaditya Singh', email: 'aaditya@example.com', password: 'Password123!', profile: profileIds[0] },
  { _id: userIds[1], name: 'Jane Doe', email: 'jane@example.com', password: 'Password123!', profile: profileIds[1] },
  { _id: userIds[2], name: 'John Smith', email: 'john@example.com', password: 'Password123!', profile: profileIds[2] },
  { _id: userIds[3], name: 'Demo User', email: 'abc@gmail.com', password: '123', profile: profileIds[3] },
];

const profiles = [
  { _id: profileIds[0], userId: userIds[0], name: 'Aaditya Singh', profileImage: { url: 'https://i.pravatar.cc/150?img=3' }, bannerImage: { url: 'https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180' }, headline: 'Software Engineer', about: 'Building scalable web apps.', contactInfo: { phone: 1234567890, email: 'aaditya@example.com' }, location: 'Delhi', skills: ['JavaScript', 'React'], education: [{ institution: 'IIT Delhi', degree: 'B.Tech', started: new Date(2018, 7, 1), ended: new Date(2022, 5, 30) }], experience: [{ jobTitle: 'Developer', companyName: 'Tech Solutions', started: new Date(2022, 6, 1), description: 'Worked on full-stack projects.' }], followerCount: 2, connCount: 2, chatList: [], myJobs: { saved: [], applied: [] }, myGroups: [] },
  { _id: profileIds[1], userId: userIds[1], name: 'Jane Doe', profileImage: { url: 'https://i.pravatar.cc/150?img=4' }, bannerImage: { url: 'https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180' }, headline: 'Frontend Dev', about: 'React enthusiast.', contactInfo: { phone: 1234567891, email: 'jane@example.com' }, location: 'Mumbai', skills: ['React', 'CSS'], education: [{ institution: 'IIT Bombay', degree: 'B.Tech', started: new Date(2017, 7, 1), ended: new Date(2021, 5, 30) }], experience: [{ jobTitle: 'Frontend Dev', companyName: 'Webify', started: new Date(2021, 6, 1), description: 'UI/UX projects.' }], followerCount: 1, connCount: 2, chatList: [], myJobs: { saved: [], applied: [] }, myGroups: [] },
  { _id: profileIds[2], userId: userIds[2], name: 'John Smith', profileImage: { url: 'https://i.pravatar.cc/150?img=5' }, bannerImage: { url: 'https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180' }, headline: 'Backend Dev', about: 'Node.js & MongoDB.', contactInfo: { phone: 1234567892, email: 'john@example.com' }, location: 'Bangalore', skills: ['Node.js', 'MongoDB'], education: [{ institution: 'IIT Madras', degree: 'B.Tech', started: new Date(2016, 7, 1), ended: new Date(2020, 5, 30) }], experience: [{ jobTitle: 'Backend Dev', companyName: 'API Corp', started: new Date(2020, 6, 1), description: 'Built REST APIs.' }], followerCount: 1, connCount: 2, chatList: [], myJobs: { saved: [], applied: [] }, myGroups: [] },
  { _id: profileIds[3], userId: userIds[3], name: 'Demo User', profileImage: { url: 'https://i.pravatar.cc/150?img=6' }, bannerImage: { url: 'https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180' }, headline: 'Demo Account', about: 'This is a demo user for login.', contactInfo: { phone: 1234567893, email: 'abc@gmail.com' }, location: 'Demo City', skills: ['Demo', 'Testing'], education: [{ institution: 'Demo University', degree: 'B.Tech', started: new Date(2015, 7, 1), ended: new Date(2019, 5, 30) }], experience: [{ jobTitle: 'Demo Engineer', companyName: 'Demo Corp', started: new Date(2019, 6, 1), description: 'Testing the LinkedIn clone.' }], followerCount: 0, connCount: 0, chatList: [], myJobs: { saved: [], applied: [] }, myGroups: [] },
];

// POSTS (each by a user)
const postIds = [createObjectId(), createObjectId(), createObjectId(), createObjectId()];
const posts = [
  { _id: postIds[0], createdBy: userIds[0], content: 'Excited to join LinkedIn Clone!', media: { mediaType: 'image', url: 'https://i.pravatar.cc/300', filename: 'img1.jpg' }, published: true, category: ['Announcement'], postType: 'Everyone', likeCount: 2, comments: [], scheduledTime: new Date() },
  { _id: postIds[1], createdBy: userIds[1], content: 'React is awesome!', media: {}, published: true, category: ['Tech'], postType: 'Everyone', likeCount: 1, comments: [], scheduledTime: new Date() },
  { _id: postIds[2], createdBy: userIds[2], content: 'Node.js tips and tricks.', media: {}, published: true, category: ['Tech'], postType: 'Connections only', likeCount: 0, comments: [], scheduledTime: new Date() },
  { _id: postIds[3], createdBy: userIds[3], content: 'This is a demo post from the demo user.', media: { mediaType: 'image', url: 'https://i.pravatar.cc/300?img=6', filename: 'demoimg.jpg' }, published: true, category: ['Demo'], postType: 'Everyone', likeCount: 0, comments: [], scheduledTime: new Date() },
];

// COMMENTS (each by a user on a post)
const commentIds = [createObjectId(), createObjectId(), createObjectId()];
const comments = [
  { _id: commentIds[0], postId: postIds[0], author: userIds[1], text: 'Congrats Aaditya!', createdAt: new Date() },
  { _id: commentIds[1], postId: postIds[1], author: userIds[2], text: 'Great post Jane!', createdAt: new Date() },
  { _id: commentIds[2], postId: postIds[3], author: userIds[3], text: 'This is a comment from the demo user.', createdAt: new Date() },
];
posts[0].comments.push(commentIds[0]);
posts[1].comments.push(commentIds[1]);
posts[3].comments.push(commentIds[2]);

// LIKES (users like posts)
const likes = [
  { postId: postIds[0], user: userIds[1] },
  { postId: postIds[0], user: userIds[2] },
  { postId: postIds[1], user: userIds[0] },
  { postId: postIds[3], user: userIds[3] },
];

// JOBS (posted by users)
const jobIds = [createObjectId()];
const jobs = [
  { _id: jobIds[0], title: 'Frontend Developer', company: 'Tech Solutions', companyLogo: '', companydescription: 'A leading tech company.', location: 'Remote', jobdescription: 'Work on React apps.', qualifications: ['B.Tech'], isOpen: true, skills: ['React', 'JS'], salary: 80000, jobType: 'Full-time', mode: 'Remote', postedBy: userIds[0], postedDate: new Date(), applications: [] },
];

// APPLICATIONS (user applies to job)
const applicationIds = [createObjectId()];
const applications = [
  { _id: applicationIds[0], jobId: jobIds[0], applicant: userIds[1], answers: ['I love React!'], resume: { filename: 'resume1.pdf', id: createObjectId() }, status: 'New', appliedAt: new Date() },
];
jobs[0].applications.push(applicationIds[0]);

// CHATS & MESSAGES (between users)
const chatIds = [createObjectId()];
const messageIds = [createObjectId(), createObjectId(), createObjectId()];
const chats = [
  { _id: chatIds[0], participants: [userIds[0], userIds[1]], createdAt: new Date(), lastMessage: messageIds[1] },
];
const messages = [
  { _id: messageIds[0], chatId: chatIds[0], sender: userIds[0], content: 'Hey Jane!', Date: new Date() },
  { _id: messageIds[1], chatId: chatIds[0], sender: userIds[1], content: 'Hi Aaditya!', Date: new Date() },
  { _id: messageIds[2], chatId: chatIds[0], sender: userIds[3], content: 'Demo user says hello!', Date: new Date() },
];

// ANALYTICS (user activity)
const analytics = [
  { user: userIds[0], triggeredBy: userIds[1], date: new Date(), eventType: 'profile_view', metaData: { postId: postIds[0] } },
  { user: userIds[3], triggeredBy: userIds[0], date: new Date(), eventType: 'profile_view', metaData: { postId: postIds[3] } },
];

// NOTIFICATIONS
const notifications = [
  { recipient: userIds[0], message: 'Jane liked your post.', sender: userIds[1], notiType: 'like', isRead: false, sentDate: new Date() },
  { recipient: userIds[3], message: 'Welcome to the demo account!', sender: userIds[0], notiType: 'response', isRead: false, sentDate: new Date() },
];

// POLLS
const pollIds = [createObjectId()];
const polls = [
  { _id: pollIds[0], question: 'Which JS framework do you prefer?', options: [ { value: 'React', votes: 2 }, { value: 'Vue', votes: 1 } ], voters: [ { user: userIds[0], optionId: createObjectId() }, { user: userIds[1], optionId: createObjectId() } ], expiresAt: new Date(Date.now() + 86400000), createdBy: userIds[0], createdAt: new Date() },
];

// CONNECTIONS & FOLLOWS
const connections = [
  { user: userIds[0], connectedUser: userIds[1], createdAt: new Date() },
  { user: userIds[1], connectedUser: userIds[2], createdAt: new Date() },
  { user: userIds[3], connectedUser: userIds[0], createdAt: new Date() },
];
const follows = [
  { user: userIds[0], userFollowed: userIds[2], createdAt: new Date() },
  { user: userIds[2], userFollowed: userIds[0], createdAt: new Date() },
  { user: userIds[3], userFollowed: userIds[1], createdAt: new Date() },
];

const init = async () => {
  try {
    await Promise.all([
      User.deleteMany({}), Profile.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({}), Like.deleteMany({}),
      Job.deleteMany({}), Application.deleteMany({}), Message.deleteMany({}), Chat.deleteMany({}), Analytic.deleteMany({}),
      Notification.deleteMany({}), Poll.deleteMany({}), Connection.deleteMany({}), Follow.deleteMany({})
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
    console.log('All relational mock data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
};

init();
