import express from "express";
import cors from "cors";
import path from "path"; // <-- TAMBAHKAN INI
import { fileURLToPath } from "url"; // <-- TAMBAHKAN INI
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/authentications.js";
import playlistsRoutes from "./routes/playlists.js";
import exportRoutes from "./routes/export.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/albums", albumsRoutes);
app.use("/songs", songsRoutes);
app.use("/users", usersRoutes);
app.use("/authentications", authRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/export", exportRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// 404 handler
app.use(notFound);
// error handler
app.use(errorHandler);

export default app;
