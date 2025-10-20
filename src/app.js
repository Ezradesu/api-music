import express from "express";
import cors from "cors";
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/authentications.js";
import playlistsRoutes from "./routes/playlists.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/albums", albumsRoutes);
app.use("/songs", songsRoutes);
app.use("/users", usersRoutes);
app.use("/authentications", authRoutes);
app.use("/playlists", playlistsRoutes);

// 404 handler
app.use(notFound);
// error handler
app.use(errorHandler);

export default app;
