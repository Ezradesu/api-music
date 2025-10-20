import express from "express";
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  deletePlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controllers/playlistController.js";
import { validateBody } from "../middlewares/validate.js";
import {
  playlistCreateSchema,
  playlistSongSchema,
} from "../validators/playlistValidator.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Semua playlist endpoint harus butuh token
router.use(authenticate);

// Create playlist
router.post("/", validateBody(playlistCreateSchema), createPlaylist);

// Get all playlists (milik user)
router.get("/", getAllPlaylists);

// Get playlist detail
router.get("/:id/songs", getPlaylistById);

// Add song to playlist
router.post("/:id/songs", validateBody(playlistSongSchema), addSongToPlaylist);

// Delete song from playlist
router.delete(
  "/:id/songs",
  validateBody(playlistSongSchema),
  removeSongFromPlaylist
);

// Delete playlist
router.delete("/:id", deletePlaylistById);

export default router;
