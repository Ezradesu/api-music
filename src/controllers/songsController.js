import { nanoid } from "nanoid";
import { pool } from "../config/database.js";

// POST /songs
export const createSong = async (req, res, next) => {
  try {
    const {
      title,
      year,
      genre,
      performer,
      duration = null,
      albumId = null,
    } = req.validated;
    const id = `song-${nanoid(16)}`;
    const query = `
      INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    const { rows } = await pool.query(query, [
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    ]);
    return res
      .status(201)
      .json({ status: "success", data: { songId: rows[0].id } });
  } catch (err) {
    return next(err);
  }
};

// GET /songs?title=&performer=
export const getSongs = async (req, res, next) => {
  try {
    const { title, performer } = req.query;
    // Build dynamic query with optional filters
    const filters = [];
    const values = [];
    let idx = 1;

    if (title) {
      filters.push(`LOWER(title) LIKE LOWER($${idx++})`);
      values.push(`%${title}%`);
    }
    if (performer) {
      filters.push(`LOWER(performer) LIKE LOWER($${idx++})`);
      values.push(`%${performer}%`);
    }

    let query = "SELECT id, title, performer FROM songs";
    if (filters.length > 0) {
      query += ` WHERE ${filters.join(" AND ")}`;
    }
    query += " ORDER BY title ASC";

    const { rows } = await pool.query(query, values);
    return res.status(200).json({ status: "success", data: { songs: rows } });
  } catch (err) {
    return next(err);
  }
};

// GET /songs/:id
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `SELECT id, title, year, performer, genre, duration, album_id as "albumId" FROM songs WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      const err = new Error("Song not found");
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({ status: "success", data: { song: rows[0] } });
  } catch (err) {
    return next(err);
  }
};

// PUT /songs/:id
export const updateSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      year,
      genre,
      performer,
      duration = null,
      albumId = null,
    } = req.validated;
    const query = `
      UPDATE songs
      SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6
      WHERE id = $7
    `;
    const result = await pool.query(query, [
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      id,
    ]);
    if (result.rowCount === 0) {
      const err = new Error("Song not found");
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({ status: "success", message: "Song updated" });
  } catch (err) {
    return next(err);
  }
};

// DELETE /songs/:id
export const deleteSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM songs WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      const err = new Error("Song not found");
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({ status: "success", message: "Song deleted" });
  } catch (err) {
    return next(err);
  }
};
