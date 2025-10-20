import { verifyAccessToken } from "../services/tokenService.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Missing access token" });
    }
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, username: payload.username }; // store needed data
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid access token" });
  }
};
