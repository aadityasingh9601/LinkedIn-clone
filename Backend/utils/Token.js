import dotenv from "dotenv";
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}
import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
