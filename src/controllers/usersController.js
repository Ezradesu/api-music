import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { pool } from "../config/database.js";
import { signAccessToken, signRefreshToken } from "../services/tokenService.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.validated;
    const r = await pool.query("SELECT id FROM users WHERE username = $1", [
      username,
    ]);
    if (r.rowCount > 0) {
      const err = new Error("Username already exists");
      err.statusCode = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = `user-${nanoid(16)}`;
    await pool.query(
      "INSERT INTO users (id, username, password, fullname) VALUES ($1,$2,$3,$4)",
      [id, username, hashed, fullname]
    );

    return res.status(201).json({ status: "success", data: { userId: id } });
  } catch (err) {
    return next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // <-- diambil dari middleware authenticate
    const result = await pool.query(
      "SELECT id, username, fullname FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const user = result.rows[0];
    return res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    next(err);
  }
};
