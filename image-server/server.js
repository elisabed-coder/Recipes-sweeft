const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Enable CORS
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname.replace(/\s+/g, "-"));
  },
});

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  },
}).single("image");

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Image server is running!" });
});

// Upload endpoint
app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("Upload error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File size too large. Maximum size is 5MB.",
        });
      }
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          error: "Invalid file type. Only JPEG, PNG and WebP are allowed.",
        });
      }
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    // Log successful upload
    console.log("File uploaded successfully:", req.file);

    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Image server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadDir}`);
});
