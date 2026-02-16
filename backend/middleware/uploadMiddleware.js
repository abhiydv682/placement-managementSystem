const multer = require("multer");
const path = require("path");

/* =========================
   STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

/* =========================
   FILE FILTER (PDF + IMAGES)
========================= */

const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /pdf|jpg|jpeg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png";

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, PNG files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

module.exports = upload;
