import pool from "../config/database.js";
import { nanoid } from "nanoid";

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

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data album
    const albumResult = await pool.query(
      "SELECT id, name, year FROM albums WHERE id = $1",
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
    const album = {
      ...albumResult.rows[0],
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
