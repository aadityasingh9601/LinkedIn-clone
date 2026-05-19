import dotenv from "dotenv";
dotenv.config();

import Profile from "../models/Profile.js";
import httpStatus from "http-status";
import { v2 as cloudinary } from "cloudinary";
import {
  EducationDataSchema,
  ExperienceDataSchema,
  ProfileHeaderDataSchema,
} from "../zodSchema/index.js";
import { convertDateToUTC } from "../utils/helper.js";

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const userProfile = await Profile.findOne({ userId: userId });
  res.status(200).json({
    userProfile,
  });
};

const getAllUserProfiles = async (req, res) => {
  const { username } = req.query;
  const users = await Profile.find({
    name: { $regex: username, $options: "i" }, // Case-insensitive search
  })
    .select("name profileImage headline userId")
    .limit(10);

  if (users.length === 0) {
    res.status(404).send({ message: "No users found!" });
  } else {
    res.status(200).send(users);
  }
};

const getAllUserGroups = async (req, res) => {
  const currUser = await Profile.findById(req.user._id);
  //const groups = await Group.find({members:{$in:[currUser._id]}});You can use this to search for groups
  //if u haven't had stored a myGroups field in the user model.
  if (currUser.myGroups.length === 0) {
    res.status(httpStatus.NOT_FOUND).send({ message: "No groups found!" });
  } else {
    res.status(200).send(currUser.myGroups);
  }
};

//Profile header section.
const updateProfileHeader = async (req, res) => {
  const { profileHeaderData } = req.body;
  const { name, headline, contactInfo, location } = profileHeaderData;

  const result = ProfileHeaderDataSchema.safeParse(profileHeaderData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const profile = await Profile.findOne({ userId: req.user._id });
  if (req.user._id.toString() !== profile.userId.toString()) {
    return res.status(403).json({ message: "Forbidden!" });
  }

  profile.name = name;
  profile.headline = headline;
  profile.contactInfo = contactInfo;
  profile.location = location;

  if (typeof req.files !== "undefined") {
    let newProfileImage = req.files?.["profileHeaderData[profileImage]"]?.[0];
    let newBannerImage = req.files?.["profileHeaderData[bannerImage]"]?.[0];

    if (newProfileImage) {
      //Delete the old profile image first.
      if (profile.profileImage.filename) {
        await cloudinary.uploader
          .destroy(profile.profileImage.filename, { resource_type: "image" })
          .then((result) => console.log(result));
      }
      profile.profileImage.filename = newProfileImage.filename;
      profile.profileImage.url = newProfileImage.path;
    }

    if (newBannerImage) {
      //Delete the old banner image first.
      if (profile.bannerImage.filename) {
        await cloudinary.uploader
          .destroy(profile.bannerImage.filename, { resource_type: "image" })
          .then((result) => console.log(result));
      }
      profile.bannerImage.filename = newBannerImage.filename;
      profile.bannerImage.url = newBannerImage.path;
    }
  }

  await profile.save();
  res.status(200).json({
    message: "Profile updated successfully!",
    updatedData: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      contactInfo: profile.contactInfo,
      profileImage: profile.profileImage,
      bannerImage: profile.bannerImage,
    },
  });
};

//Skills section.
const addNewSkill = async (req, res) => {
  const { newSkill } = req.body;
  const profile = await Profile.findOne({ userId: req.user._id });
  if (profile.skills.indexOf(newSkill.toLowerCase()) != -1) {
    return res.status(400).json({
      message: "Skill already exists!",
    });
  }
  profile.skills.push(newSkill);
  await profile.save();

  res.status(200).json({
    message: "Skill added successfully!",
  });
};

const deleteSkill = async (req, res) => {
  const { skill } = req.query;
  console.log(skill);
  const profile = await Profile.findOne({ userId: req.user._id });
  profile.skills.splice(profile.skills.indexOf(skill), 1);
  await profile.save();

  res.status(200).json({
    message: "Deleted successfully!",
  });
};

//About section.
const updateAboutSection = async (req, res) => {
  const { data } = req.body;
  const profile = await Profile.findOne({ userId: req.user._id });
  profile.about = data;
  await profile.save();

  res.status(200).json({
    message: "Profile updated successfully!",
    updatedData: profile.about,
  });
};

//Education section.
const addEducation = async (req, res) => {
  const { educationData } = req.body;
  const result = EducationDataSchema.safeParse(educationData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const profile = await Profile.findOne({ userId: req.user._id });
  profile.education.push({
    ...educationData,
    started: convertDateToUTC(educationData.started),
    ended: convertDateToUTC(educationData.ended),
  });
  await profile.save();

  const newEducationData = profile.education.find(
    (e) => e.degree === educationData.degree,
  );
  res.status(200).json({
    message: "Education added successfully!",
    newEducation: newEducationData,
  });
};

const updateEducation = async (req, res) => {
  const { id } = req.params;
  const { educationData } = req.body;
  const result = EducationDataSchema.safeParse(educationData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const updateFields = {};
  for (const key in educationData) {
    updateFields[`education.$.${key}`] = educationData[key]; // Dynamically add fields to update
  }
  const updatedProfile = await Profile.findOneAndUpdate(
    { userId: req.user._id, "education._id": id },
    {
      $set: {
        ...updateFields,
        "education.$.started": convertDateToUTC(educationData.started),
        "education.$.ended": convertDateToUTC(educationData.ended),
      },
    },
  );
  const updatedEducation = updatedProfile.education.find(
    (e) => e._id.toString() === id,
  );
  res.status(200).json({
    message: "Updated successfully!",
    updatedEducation: updatedEducation,
  });
};

const deleteEducation = async (req, res) => {
  const { id } = req.params;
  await Profile.updateOne(
    { userId: req.user._id },
    { $pull: { education: { _id: id } } },
  );

  res.status(200).json({
    message: "Deleted successfully!",
  });
};

//Experience section.
const addExperience = async (req, res) => {
  const { experienceData } = req.body;
  const result = ExperienceDataSchema.safeParse(experienceData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const profile = await Profile.findOne({ userId: req.user._id });
  profile.experience.push({
    ...experienceData,
    started: convertDateToUTC(experienceData.started),
    ended: convertDateToUTC(experienceData.ended),
  });
  await profile.save();

  const newExperienceData = profile.experience.find(
    (e) => e.degree === experienceData.degree,
  );
  res.status(200).json({
    message: "Experience added successfully!",
    newExperience: newExperienceData,
  });
};

const updateExperience = async (req, res) => {
  const { id } = req.params;
  const { experienceData } = req.body;
  const result = ExperienceDataSchema.safeParse(experienceData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const updateFields = {};
  for (const key in experienceData) {
    updateFields[`experience.$.${key}`] = experienceData[key]; // Dynamically add fields to update
  }
  const updatedProfile = await Profile.findOneAndUpdate(
    { userId: req.user._id, "experience._id": id },
    {
      $set: {
        ...updateFields,
        "experience.$.started": convertDateToUTC(experienceData.started),
        "experience.$.ended": convertDateToUTC(experienceData.ended),
      },
    },
  );
  const updatedExperience = updatedProfile.experience.find(
    (e) => e._id.toString() === id,
  );
  res.status(200).json({
    message: "Updated successfully!",
    updatedExperience: updatedExperience,
  });
};

const deleteExperience = async (req, res) => {
  const { id } = req.params;
  await Profile.updateOne(
    { userId: req.user._id },
    { $pull: { experience: { _id: id } } },
  );

  res.status(200).json({
    message: "Deleted successfully!",
  });
};

export default {
  getUserProfile,
  getAllUserProfiles,
  getAllUserGroups,
  updateProfileHeader,
  addNewSkill,
  deleteSkill,
  updateAboutSection,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
};
