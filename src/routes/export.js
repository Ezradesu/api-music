import express from "express";
import {
  postExportPlaylist,
  validateExportBody,
} from "../controllers/exportController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
  "/playlists/:playlistId",
  authenticate,
  validateExportBody,
  postExportPlaylist
);

export default router;
