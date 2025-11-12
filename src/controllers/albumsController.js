import pool from "../config/database.js";
import { nanoid } from "nanoid";
import StorageService from "../services/storage/StorageService.js";

export const addAlbum = async (req, res) => {
  try {
    const { name, year } = req.body;
    if (!name || !year) {
      return res
        .status(400)
        .json({ status: "fail", message: "Name and year are required" });
    }

    const id = `album-${nanoid(16)}`;
    await pool.query(
      "INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)",
      [id, name, year]
    );

    res.status(201).json({
      status: "success",
      data: { albumId: id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getAllAlbums = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, year FROM albums");
    res.status(200).json({
      status: "success",
      data: { albums: result.rows },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const postAlbumCover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file } = req; // file dari multer

    // Cek dulu apakah album ada
    const albumRes = await pool.query(
      "SELECT id, cover_url FROM albums WHERE id = $1",
      [id]
    );
    if (albumRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    const storageService = new StorageService();
    const fileUrl = await storageService.writeFile(file.buffer, file.mimetype);

    // Update cover_url di database
    await pool.query("UPDATE albums SET cover_url = $1 WHERE id = $2", [
      fileUrl,
      id,
    ]);

    // (Opsional: Hapus file lama jika ada)
    // if (albumRes.rows[0].cover_url) { ... logika hapus file lama ... }

    return res.status(201).json({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data album (TAMBAHKAN cover_url)
    const albumResult = await pool.query(
      "SELECT id, name, year, cover_url FROM albums WHERE id = $1", // <-- MODIFIKASI QUERY
      [id]
    );

    if (albumResult.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    // Ambil daftar lagu di album ini
    const songsResult = await pool.query(
      "SELECT id, title, performer FROM songs WHERE album_id = $1",
      [id]
    );

    // Gabungkan hasilnya
    const albumData = albumResult.rows[0];
    const album = {
      id: albumData.id,
      name: albumData.name,
      year: albumData.year,
      coverUrl: albumData.cover_url || null, // <-- MODIFIKASI HASIL
      songs: songsResult.rows,
    };

    res.status(200).json({
      status: "success",
      data: { album },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
export const updateAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year } = req.body;

    if (!name || !year) {
      return res
        .status(400)
        .json({ status: "fail", message: "Name and year are required" });
    }

    const result = await pool.query(
      "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      [name, year, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Album updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const deleteAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM albums WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Album not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
