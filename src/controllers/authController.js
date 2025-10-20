import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.validated;

    const r = await pool.query(
      "SELECT id, password FROM users WHERE username = $1",
      [username]
    );
    if (r.rowCount === 0) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const user = r.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const payload = { userId: user.id, username };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // simpan refresh token di DB (tabel authentications)
    await pool.query(
      "INSERT INTO authentications (token, user_id) VALUES ($1, $2)",
      [refreshToken, user.id]
    );

    return res
      .status(201)
      .json({ status: "success", data: { accessToken, refreshToken } });
  } catch (err) {
    return next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    // verifikasi signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid refresh token" });
    }

    // cek terdaftar
    const r = await pool.query(
      "SELECT token FROM authentications WHERE token = $1",
      [refreshToken]
    );
    if (r.rowCount === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Refresh token not found" });
    }

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      username: payload.username,
    });

    return res
      .status(200)
      .json({ status: "success", data: { accessToken: newAccessToken } });
  } catch (err) {
    return next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    const r = await pool.query(
      "DELETE FROM authentications WHERE token = $1 RETURNING token",
      [refreshToken]
    );
    if (r.rowCount === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Refresh token not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Logout successful" });
  } catch (err) {
    return next(err);
  }
};
