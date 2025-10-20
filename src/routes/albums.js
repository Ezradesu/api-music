import express from "express";
import {
  addAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
} from "../controllers/albumsController.js";
import { validateBody } from "../middlewares/validate.js";
import { albumCreateSchema } from "../validators/albumValidator.js";

const router = express.Router();

router.post("/", validateBody(albumCreateSchema), addAlbum);
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);
router.put("/:id", validateBody(albumCreateSchema), updateAlbumById);
router.delete("/:id", deleteAlbumById);

export default router;
