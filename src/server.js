import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
