const express = require("express");
const driveRoutes = express.Router();

const {
  createDrive,
  getAllDrives,
  getActiveDrives,
  getCompanyDrives,
  getSingleDrive,   // 🔥 Added
  deleteDrive,
  updateDrive,
  getDriveById
} = require("../controllers/driveController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

/* =====================================
   ADMIN ROUTES
===================================== */

// 🔹 Get All Drives (Admin Dashboard)
driveRoutes.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAllDrives
);

// 🔹 Create Drive
driveRoutes.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDrive
);

// 🔹 Update Drive
driveRoutes.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateDrive
);

// 🔹 Delete Drive
driveRoutes.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteDrive
);

/* =====================================
   STUDENT ROUTES
===================================== */

// 🔹 Get Active Drives
driveRoutes.get(
  "/active",
  protect,
  authorizeRoles("student"),
  getActiveDrives
);

/* =====================================
   RECRUITER ROUTES
===================================== */

// 🔹 Get Company Drives
driveRoutes.get(
  "/company",
  protect,
  authorizeRoles("recruiter"),
  getCompanyDrives
);

/* =====================================
   SHARED ROUTE (Detail Page)
===================================== */

// 🔹 Get Single Drive (Detail Page)
driveRoutes.get(
  "/:id",
  protect,
  getSingleDrive
);


module.exports = driveRoutes;
