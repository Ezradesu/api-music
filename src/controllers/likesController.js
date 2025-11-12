import pool from "../config/database.js";
import { nanoid } from "nanoid";
import CacheService from "../services/cache/CacheService.js";

// Buat satu instance cache service untuk digunakan bersama
const cacheService = new CacheService();

const CACHE_KEY_PREFIX = "album_likes:";

// 1. Menambahkan Like
export const postAlbumLike = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    // Cek dulu apakah album ada
    const albumRes = await pool.query("SELECT id FROM albums WHERE id = $1", [
      albumId,
    ]);
    if (albumRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    // Cek apakah sudah di-like
    const likeRes = await pool.query(
      "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      [userId, albumId]
    );

    if (likeRes.rowCount > 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Album already liked by user" });
    }

    // Tambahkan like
    const likeId = `like-${nanoid(16)}`;
    await pool.query(
      "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3)",
      [likeId, userId, albumId]
    );

    // Hapus cache
    await cacheService.del(`${CACHE_KEY_PREFIX}${albumId}`);

    return res.status(201).json({
      status: "success",
      message: "Album liked successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// 2. Menghapus Like
export const deleteAlbumLike = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    const result = await pool.query(
      "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      [userId, albumId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Like not found or album not found" });
    }

    // Hapus cache
    await cacheService.del(`${CACHE_KEY_PREFIX}${albumId}`);

    return res.status(200).json({
      status: "success",
      message: "Album unliked successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// 3. Mendapatkan Jumlah Like (dengan Cache)
export const getAlbumLikes = async (req, res, next) => {
  try {
    const { id: albumId } = req.params;
    const cacheKey = `${CACHE_KEY_PREFIX}${albumId}`;

    // Coba ambil dari cache
    const cachedLikes = await cacheService.get(cacheKey);
    if (cachedLikes !== null) {
      res.setHeader("X-Data-Source", "cache");
      return res.status(200).json({
        status: "success",
        data: {
          likes: parseInt(cachedLikes, 10),
        },
      });
    }

    // Jika tidak ada di cache, query ke DB
    // Cek dulu apakah album ada
    const albumRes = await pool.query("SELECT id FROM albums WHERE id = $1", [
      albumId,
    ]);
    if (albumRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    // Hitung likes
    const likesRes = await pool.query(
      "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
      [albumId]
    );
    const likes = parseInt(likesRes.rows[0].count, 10);

    // Simpan ke cache (30 menit = 1800 detik)
    await cacheService.set(cacheKey, likes.toString(), 1800);

    return res.status(200).json({
      status: "success",
      data: {
        likes: likes,
      },
    });
  } catch (error) {
    return next(error);
  }
};
