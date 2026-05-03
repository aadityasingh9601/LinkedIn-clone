import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.accesstoken) {
    try {
      token = req.cookies.accesstoken;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.id).select(
        "-password -refreshToken",
      ); // Get user without password

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;

//Understand this code from ChatGPT.
//Import this route whereever you need like a middleware to be used in your protected routes(that renders the user information).
