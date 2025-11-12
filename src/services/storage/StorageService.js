import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import "dotenv/config";

// Helper untuk mendapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
  constructor() {
    this._folder = path.resolve(__dirname, "../../../uploads/images");

    // Buat folder jika belum ada
    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }
  }

  writeFile(fileBuffer, mimetype) {
    return new Promise((resolve, reject) => {
      const extension = mimetype.split("/")[1];
      const filename = `${nanoid(16)}.${extension}`;
      const filepath = path.resolve(this._folder, filename);

      fs.writeFile(filepath, fileBuffer, (err) => {
        if (err) {
          return reject(err);
        }

        // Buat URL yang bisa diakses publik
        const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;
        return resolve(fileUrl);
      });
    });
  }
}

export default StorageService;
