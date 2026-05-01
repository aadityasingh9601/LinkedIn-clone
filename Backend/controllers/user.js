import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Like from "../models/Like.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import jwt from "jsonwebtoken";
import Profile from "../models/Profile.js";
import {
  SignupDataSchema,
  LoginDataSchema,
  AccountSetupDataSchema,
} from "../zodSchema/index.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const checkAuthStatus = async (req, res) => {
  let accesstoken = req.cookies.accesstoken;
  let decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findOne({ _id: decoded.id });
  res.status(200).json({ isSetupComplete: user.profile !== undefined });
};

const signup = async (req, res) => {
  const { signupData } = req.body;
  const result = SignupDataSchema.safeParse(signupData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }
  const existingUser = await User.findOne({ email: signupData.email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists!" });
  }
  try {
    const hashedPassword = (
      await bcrypt.hash(signupData.password, 16)
    ).toString("hex");

    const newUser = new User({
      name: signupData.name,
      email: signupData.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user!" });
  }
};

const login = async (req, res) => {
  const { loginData } = req.body;
  const result = LoginDataSchema.safeParse(loginData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  try {
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const validPassword = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push(refreshToken);
    let id = user._id;
    await user.save();

    res
      .cookie("accesstoken", accessToken, {
        ...options,
        maxAge: 60 * 60 * 1000, //1hr
      })
      .cookie("refreshtoken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      })
      .status(200)
      .json({ id, isSetupComplete: user.profile !== undefined });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
  }
};

const setupAccount = async (req, res) => {
  const { userId } = req.params;
  const { setupData } = req.body;
  const { phone, city, country } = setupData;

  const result = AccountSetupDataSchema.safeParse(setupData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userProfile = new Profile({
    userId: user._id,
    name: user.name,
    contactInfo: {
      phone: phone,
      email: user.email,
    },
    location: city + "," + country,
  });

  await userProfile.save();
  user.profile = userProfile._id;
  await user.save();
  return res.status(200).json({
    message: "Account setup successful!",
  });
};

const refreshAccessToken = async (req, res) => {
  const existingRefreshToken = req.cookies.refreshtoken;
  if (!existingRefreshToken) {
    return res.status(401).json({ message: "No refresh token available." });
  }
  let decoded;
  try {
    decoded = jwt.verify(
      existingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Refresh token expired or invalid!" });
  }

  let user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  let userId = user._id;
  const valid = user.refreshTokens?.includes(existingRefreshToken);
  if (!valid) {
    return res
      .status(401)
      .json({ message: "Refresh token is invalid or expired!" });
  }

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);
  //Remove the old refresh token.
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== existingRefreshToken,
  );
  //Save the new refresh token.
  user.refreshTokens.push(newRefreshToken);
  await user.save();
  res
    .cookie("accesstoken", newAccessToken, {
      ...options,
      maxAge: 60 * 60 * 1000, //1hr
    })
    .cookie("refreshtoken", newRefreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    })
    .status(200)
    .json({ userId });
};

const allLikedPosts = async (req, res) => {
  const allLikedPosts = await Like.find({ user: req.user._id });
  const likedPosts = allLikedPosts.map((p) => {
    return p.postId;
  });
  res.status(200).json(likedPosts);
};

const logout = async (req, res) => {
  const { userId } = req.params;
  const oldRefreshToken = req.cookies.refreshtoken;
  const user = await User.findById(userId).select("-password");
  //Remove the old refresh token from the database.
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== oldRefreshToken,
  );
  await user.save();
  res
    .clearCookie("refreshtoken", options)
    .clearCookie("accesstoken", options)
    .status(200)
    .json({ message: "Logout successfully!" });
};

export default {
  checkAuthStatus,
  signup,
  login,
  setupAccount,
  logout,
  allLikedPosts,
  refreshAccessToken,
};
