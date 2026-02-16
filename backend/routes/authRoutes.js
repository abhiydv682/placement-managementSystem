const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/* =============================
    AUTH ROUTES
============================= */

// Register student/admin
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", protect, logout);

// Get Current Logged User (Base route)
router.get("/me", protect, getCurrentUser);

/* =============================
    PROFILE ROUTES
============================= */

// 🔥 GET Profile: Frontend data auto-fill ke liye zaroori hai
router.get("/profile", protect, getCurrentUser); 

// UPDATE Profile: Supports Resume and Profile Pic
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  updateProfile
);

module.exports = router;