import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import { signupSchema, loginSchema } from "../schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Profile from "../models/Profile.js";
dotenv.config();

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
};

const checkTokenCookie = async (req, res) => {
  //console.log(req.cookies);
  if (req.cookies && req.cookies.refreshtoken) {
    res.status(200).send("yes");
  } else {
    res.status(200).send("no");
  }
};

const signup = async (req, res) => {
  const { signupData } = req.body;
  const { error } = signupSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(404).send({
      error: error,
    });
    return;
  }
  console.log(req.body);

  if (!signupData.name || !signupData.email || !signupData.password) {
    console.log("1");
    return res
      .status(400)
      .send({ message: "Please provide all required fields" });
  }

  const existingUser = await User.findOne({ email: signupData.email });
  if (existingUser) {
    console.log("2");
    return res.status(400).json({ message: "Email already exists" });
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

    const userProfile = new Profile({
      userId: newUser._id,
      name: newUser.name,
    });

    await userProfile.save();

    newUser.profile = userProfile._id;
    await newUser.save();

    //console.log(userProfile);

    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  console.log(req.cookies);
  //console.log(req.headers);
  const { loginData } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(404).send({
      error: error,
    });
    return;
  }

  if (!loginData.email || !loginData.password) {
    return res
      .status(400)
      .send({ message: "Please provide both email and password" });
  }

  try {
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Wrong password" });
    }

    //Generate token and send it to the client.

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    //use this to generate further access token once it's expired.
    let id = user._id;

    await user.save();

    res
      .cookie("accesstoken", accessToken, {
        ...options, //Spread the options object to combine with the maxAge and create a single object.
        maxAge: 60 * 60 * 1000, //1hr
      })
      .cookie("refreshtoken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000, //Expiration time must be same as expiration time of jwt token.
      })
      .status(200)
      .send({ id });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error logging in" });
  }
};

const generateNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  //console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).send({ message: "No refresh token available." });
  }

  //Check if the refresh token exists in database or not.
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  let user = await User.findById(decoded.id).select("-password  ");

  const valid = user.refreshTokens.includes(refreshToken);
  if (!valid) {
    console.log("not valid");
    return res
      .status(403)
      .send({ message: "Refresh token is invalid or expired." });
  }

  try {
    //Generate new access token if everything is ok.
    const accessToken = generateAccessToken(user.id);

    res
      .cookie("accesstoken", accessToken, {
        ...options, // Ensures the cookie is only sent in a first-party context
        maxAge: 60 * 60 * 1000,
      })
      .sendStatus(201);
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .send({ message: "Invalid or expired refresh token." });
  }
};

const logout = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshtoken;
  console.log(oldRefreshToken);
  if (!oldRefreshToken) {
    return res.status(401).send("No refresh token available.");
  }

  const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res.status(403).send("Refresh token is expired or invalid.");
  }

  //Remove the old refresh token from the database.

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== oldRefreshToken
  );
  await user.save();

  //Remove the userId from the local storage.

  //Delete the cookie from the client.
  res
    .clearCookie("refreshtoken")
    .clearCookie("accesstoken")
    .status(200)
    .send("Logout successfully!");
};

export default {
  checkTokenCookie,
  signup,
  login,
  logout,
  generateNewAccessToken,
};
