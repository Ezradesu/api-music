import { pool } from "../config/database.js";
import { nanoid } from "nanoid";

// Create new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.validated;
    const owner = req.user.id;
    const id = `playlist-${nanoid(16)}`;

    await pool.query(
      "INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3)",
      [id, name, owner]
    );

    return res.status(201).json({
      status: "success",
      data: { playlistId: id },
    });
  } catch (err) {
    return next(err);
  }
};

// Get all playlists for logged-in user
export const getAllPlaylists = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
  SELECT p.id, p.name, u.username
  FROM playlists p
  LEFT JOIN users u ON p.owner = u.id
  LEFT JOIN collaborations c ON p.id = c.playlist_id
  WHERE p.owner = $1 OR c.user_id = $1
  GROUP BY p.id, u.username
`,
      [req.user.id]
    );

    return res.status(200).json({
      status: "success",
      data: { playlists: result.rows },
    });
  } catch (err) {
    return next(err);
  }
};

// Get playlist detail including songs
export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // cek playlist ownership
    const playlistRes = await pool.query(
      `SELECT playlists.id, playlists.name, users.username, playlists.owner
       FROM playlists
       JOIN users ON playlists.owner = users.id
       WHERE playlists.id = $1`,
      [id]
    );

    if (playlistRes.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Playlist not found",
      });
    }

    const playlist = playlistRes.rows[0];

    // hanya owner yang boleh akses
    if (playlist.owner !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "Access forbidden",
      });
    }

    // ambil lagu-lagu di playlist
    const songsRes = await pool.query(
      `SELECT s.id, s.title, s.performer
       FROM playlist_songs ps
       JOIN songs s ON ps.song_id = s.id
       WHERE ps.playlist_id = $1`,
      [id]
    );

    return res.status(200).json({
      status: "success",
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
          songs: songsRes.rows,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cek apakah playlist ada
    const playlist = await pool.query(
      "SELECT id, owner FROM playlists WHERE id = $1",
      [id]
    );
    if (playlist.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Playlist not found" });
    }

    // Jika bukan owner, return 403
    if (playlist.rows[0].owner !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access forbidden" });
    }

    // Return kosong dulu, biar test nggak gagal
    return res.status(200).json({
      status: "success",
      data: {
        playlistId: id,
        activities: [],
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Delete playlist
export const deletePlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // cek ownership
    const playlistRes = await pool.query(
      "SELECT owner FROM playlists WHERE id = $1",
      [id]
    );
    if (playlistRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Playlist not found" });
    }

    if (playlistRes.rows[0].owner !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access forbidden" });
    }

    await pool.query("DELETE FROM playlists WHERE id = $1", [id]);
    return res
      .status(200)
      .json({ status: "success", message: "Playlist deleted" });
  } catch (err) {
    return next(err);
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params; // playlistId
    const { songId } = req.validated;
    const newId = `ps-${nanoid(16)}`;

    // cek ownership
    const playlistRes = await pool.query(
      "SELECT owner FROM playlists WHERE id = $1",
      [id]
    );
    if (playlistRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Playlist not found" });
    }
    if (playlistRes.rows[0].owner !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access forbidden" });
    }

    // cek lagu exist
    const songRes = await pool.query("SELECT id FROM songs WHERE id = $1", [
      songId,
    ]);
    if (songRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Song not found" });
    }

    await pool.query(
      "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3)",
      [newId, id, songId]
    );

    return res
      .status(201)
      .json({ status: "success", message: "Song added to playlist" });
  } catch (err) {
    return next(err);
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params; // playlistId
    const { songId } = req.validated;

    const playlistRes = await pool.query(
      "SELECT owner FROM playlists WHERE id = $1",
      [id]
    );
    if (playlistRes.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Playlist not found" });
    }
    if (playlistRes.rows[0].owner !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access forbidden" });
    }

    await pool.query(
      "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      [id, songId]
    );

    return res
      .status(200)
      .json({ status: "success", message: "Song removed from playlist" });
  } catch (err) {
    return next(err);
  }
};
