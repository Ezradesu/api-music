import jwt from "jsonwebtoken";

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || "access-secret";
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY || "refresh-secret";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_KEY, { expiresIn: "1h" });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_KEY, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_KEY);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_KEY);
};
