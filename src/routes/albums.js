import express from "express";
import {
  addAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
  postAlbumCover,
} from "../controllers/albumsController.js";
import {
  postAlbumLike,
  deleteAlbumLike,
  getAlbumLikes,
} from "../controllers/likesController.js"; // <-- IMPORT BARU
import { validateBody } from "../middlewares/validate.js";
import { albumCreateSchema } from "../validators/albumValidator.js";
import { uploadCover } from "../middlewares/uploads.js";
import { authenticate } from "../middlewares/authenticate.js"; // <-- IMPORT BARU

const router = express.Router();

// ... (route album & cover yang sudah ada) ...
router.post("/", validateBody(albumCreateSchema), addAlbum);
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);
router.put("/:id", validateBody(albumCreateSchema), updateAlbumById);
router.delete("/:id", deleteAlbumById);
router.post("/:id/covers", uploadCover, postAlbumCover);

// <-- ROUTE BARU UNTUK LIKES -->
router.post("/:id/likes", authenticate, postAlbumLike);
router.delete("/:id/likes", authenticate, deleteAlbumLike);
router.get("/:id/likes", getAlbumLikes); // Tidak perlu autentikasi sesuai kriteria

export default router;
