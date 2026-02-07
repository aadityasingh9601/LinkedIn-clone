import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";
import User from "./models/User.js";

//Middleware to validate the token sent to the server by the client.If valid, only then the next task will be done.
//Remember, also create the functionality to expire the token after a certain time period because suppose, the token never expires and someone
//got your token , so they will be able to access your account forever. That's why expiring tokens and cookies are so important.
const protect = async (req, res, next) => {
  let token;

  if (
    // req.headers.authorization &&
    // req.headers.authorization.startsWith("Bearer")
    req.cookies.accesstoken
  ) {
    try {
      //token = req.headers.authorization.split(" ")[1];
      token = req.cookies.accesstoken;
      console.log(token, "1");
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
