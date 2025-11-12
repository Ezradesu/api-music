import pool from "../config/database.js";
import ProducerService from "../services/rabbitmq/ProducerService.js";
import { validateBody } from "../middlewares/validate.js";
import { exportPlaylistSchema } from "../validators/exportValidator.js";

// Middleware untuk validasi
export const validateExportBody = validateBody(exportPlaylistSchema);

// Handler utama
export const postExportPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { targetEmail } = req.validated;
    const userId = req.user.id;

    // 1. Verifikasi kepemilikan playlist
    const playlistRes = await pool.query(
      "SELECT owner FROM playlists WHERE id = $1",
      [playlistId]
    );

    if (playlistRes.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Playlist not found",
      });
    }

    if (playlistRes.rows[0].owner !== userId) {
      return res.status(403).json({
        status: "fail",
        message: "Access forbidden: You are not the owner of this playlist",
      });
    }

    // 2. Kirim pesan ke RabbitMQ
    const message = JSON.stringify({
      playlistId,
      targetEmail,
    });

    await ProducerService.sendMessage("export:playlists", message);

    // 3. Kembalikan response
    return res.status(201).json({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
  } catch (err) {
    return next(err);
  }
};
