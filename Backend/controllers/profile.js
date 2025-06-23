import Profile from "../models/Profile.js";
import httpStatus from "http-status";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  const userProfile = await Profile.findOne({ userId: userId });
  //console.log(userProfile);
  res.status(200).send(userProfile);
};

const getAllUserProfiles = async (req, res) => {
  //WE HAVE TO FIX IT TO ENSURE THAT ALL USERS GOT SELECTED THAT MATCHES THE ENTRY SENT BY THE USER.
  console.log("inside getAllUserProfiles ");
  const { username } = req.body;

  //console.log(req.body);
  const users = await Profile.find({
    name: { $regex: username, $options: "i" }, // Case-insensitive search
  })
    .select("name profileImage headline userId")
    .limit(10); // Optional: Limit results to 10 users

  // const users = await Profile.find(
  //   { name: username },
  //   { name: 1, profileImage: 1, headline: 1, userId: 1 }
  // );
  // console.log(users);
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

const createProfile = async (req, res) => {
  console.log("inside createProfile on backend");
  const { userId } = req.params;
  console.log("54", userId);
  //console.log(req.files);
  //console.log(req.files["data[profileImage]"]);

  const profile = await Profile.findOne({ userId: userId });
  if (req.user._id.toString() === profile.userId.toString()) {
    const { data } = req.body;
    const {
      name,
      headline,
      about,
      skill,
      education,
      experience,
      contactInfo,
      location,
    } = data;
    //console.log(req.body);

    // console.log(data);

    if (name) {
      profile.name = name;
    }

    if (headline) {
      profile.headline = headline;
    }
    if (about) {
      profile.about = about;
    }
    if (skill) {
      profile.skills.push(skill);
    }
    if (education) {
      profile.education.push(education);
    }
    if (experience) {
      profile.experience.push(experience);
    }
    if (location) {
      profile.location = location;
    }
    if (contactInfo) {
      profile.contactInfo.email = contactInfo.email;
      profile.contactInfo.phone = contactInfo.phone;
    }

    if (typeof req.files !== "undefined") {
      //We're using ternary operators here, to ensure that error doesn't occur while user only tries to change
      //any one of the image, because if user tries to change only one of the images then the other will throw
      //error because the req.files object won't have any key for the other image, so error will be thrown.That's
      //why we are using ternary operators to check first for the key , if it exists or not,only then select.

      let newProfileImage = req.files["data[profileImage]"]
        ? req.files["data[profileImage]"][0]
        : null;

      let newBannerImage = req.files["data[bannerImage]"]
        ? req.files["data[bannerImage]"][0]
        : null;
      //console.log(newProfileImage);
      //console.log(newBannerImage);

      //Make sure to first delete the old profile or banner image from the cloud, else, it will just keep taking up
      //our cloud storage space.

      if (newProfileImage) {
        //Delete the old profile image first.
        //run this only when the user already has a profile image.
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
        //run this only when the user already has a banner image.
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
    console.log(profile);
    //res.status(200).send({ message: "Profile updated successfully" });
    res.status(200).send(profile);
  } else {
    res.status(401).send({ message: "You are not the user of this account!" });
  }
};

const updateProfile = async (req, res) => {
  console.log("inside update profile on backend");
  const { userId } = req.params;
  const { data } = req.body;
  const profile = await Profile.findOne({ userId: userId });
  if (req.user._id.toString() === profile.userId.toString()) {
    const { section, sectionId, newData } = data;
    //console.log(section);
    // console.log(sectionId);
    //console.log(newData);

    if (section === "about") {
      profile.about = newData;
      await profile.save();
    }

    if (section === "experience") {
      const updateFields = {};

      for (const key in newData) {
        updateFields[`experience.$.${key}`] = newData[key]; // Dynamically add fields to update
      }
      await Profile.updateOne(
        { userId: userId, "experience._id": sectionId },
        { $set: updateFields }
      );
    }

    if (section === "education") {
      const updateFields = {};

      for (const key in newData) {
        updateFields[`education.$.${key}`] = newData[key]; // Dynamically add fields to update
      }
      await Profile.updateOne(
        { userId: userId, "education._id": sectionId },
        { $set: updateFields } // Only update the specified fields
      );
    }

    //Re-fetch the profile to send the updated profile data to the frontend,if you send the profile that was
    //fetched earlier then it wouldn't be updated.That's why, refetching is necessary here.

    const updatedProfile = await Profile.findOne({ userId: userId });
    res.status(200).send(updatedProfile);
  } else {
    res.status(401).send({ message: "You are not the user of this account" });
  }
};

const deleteProfile = async (req, res) => {
  const { userId } = req.params;
  const { skill, section, sectionId } = req.query;
  console.log(req.query);

  const profile = await Profile.findOne({ userId: userId });

  if (req.user._id.toString() === profile.userId.toString()) {
    if (skill) {
      let idx = profile.skills.indexOf(skill);
      profile.skills.splice(idx, 1);
    }
    if (section === "experience") {
      await Profile.updateOne(
        { userId: userId },
        { $pull: { experience: { _id: sectionId } } }
      );
    }
    if (section === "education") {
      await Profile.updateOne(
        { userId: userId },
        { $pull: { education: { _id: sectionId } } }
      );
    }
    await profile.save();
    res.status(200).send({ message: "Deletion successful!" });
  } else {
    res.status(401).send({ message: "You are not the user of this account." });
  }
};

export default {
  getUserProfile,
  getAllUserProfiles,
  getAllUserGroups,
  createProfile,
  updateProfile,
  deleteProfile,
};
