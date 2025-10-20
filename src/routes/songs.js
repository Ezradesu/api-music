import express from "express";
import {
  createSong,
  getSongs,
  getSongById,
  updateSongById,
  deleteSongById,
} from "../controllers/songsController.js";
import { validateBody } from "../middlewares/validate.js";
import { songCreateSchema } from "../validators/songValidator.js";

const router = express.Router();

router.post("/", validateBody(songCreateSchema), createSong);
router.get("/", getSongs);
router.get("/:id", getSongById);
router.put("/:id", validateBody(songCreateSchema), updateSongById);
router.delete("/:id", deleteSongById);

export default router;
