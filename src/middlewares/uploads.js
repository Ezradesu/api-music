import multer from "multer";

const storage = multer.memoryStorage(); // Simpan sebagai buffer di memori

const fileFilter = (req, file, cb) => {
  // Filter tipe file
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Kirim error jika tipe file tidak sesuai
    const err = new Error(
      "File type not allowed. Only JPEG, PNG, GIF are permitted."
    );
    err.status = 400; // Bad Request
    cb(err, false);
  }
};

const limits = {
  fileSize: 512000, // 512 KB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
}).single("cover"); // Nama field harus "cover"

// Middleware wrapper untuk error handling
export const uploadCover = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error dari Multer (e.g., file terlalu besar)
      const error = new Error(err.message);
      error.status = 400;
      return next(error);
    } else if (err) {
      // Error kustom (e.g., tipe file salah)
      return next(err);
    }
    // Tidak ada file
    if (!req.file) {
      const error = new Error("No file uploaded. 'cover' field is required.");
      error.status = 400;
      return next(error);
    }
    // Sukses
    next();
  });
};
