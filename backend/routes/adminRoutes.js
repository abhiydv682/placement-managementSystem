const express = require("express");
const adminRoutes = express.Router();

const {
  createCompany,
  createRecruiter,
  getDashboardStats,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyDetails,
  removeRecruiter,
  getRecruiterStats,
  getRecruiterRanking,
  getDriveAnalytics,

  getAllApplications,
  addExistingRecruiter,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

/* =========================
   COMPANY ROUTES
========================= */

// Create company
adminRoutes.post(
  "/company",
  protect,
  authorizeRoles("admin"),
  createCompany
);

// Get all companies
adminRoutes.get(
  "/companies",
  protect,
  authorizeRoles("admin"),
  getAllCompanies
);

// Update company
adminRoutes.put(
  "/company/:id",
  protect,
  authorizeRoles("admin"),
  updateCompany
);

// Delete company
adminRoutes.delete(
  "/company/:id",
  protect,
  authorizeRoles("admin"),
  deleteCompany
);

/* =========================
   RECRUITER ROUTE
========================= */

// Create recruiter
adminRoutes.post(
  "/recruiter",
  protect,
  authorizeRoles("admin"),
  createRecruiter
);

adminRoutes.post(
  "/recruiter/link",
  protect,
  authorizeRoles("admin"),
  addExistingRecruiter
);

/* =========================
   DASHBOARD
========================= */

adminRoutes.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

adminRoutes.get(
  "/company/:id",
  protect,
  authorizeRoles("admin"),
  getCompanyDetails
);

adminRoutes.delete(
  "/recruiter/:recruiterId",
  protect,
  authorizeRoles("admin"),
  removeRecruiter
);

adminRoutes.get(
  "/recruiter-stats/:recruiterId",
  protect,
  authorizeRoles("admin"),
  getRecruiterStats
);

adminRoutes.get(
  "/recruiter-ranking",
  protect,
  authorizeRoles("admin"),
  getRecruiterRanking
);

adminRoutes.get(
  "/drive-analytics",
  protect,
  authorizeRoles("admin"),
  getDriveAnalytics
);

adminRoutes.get(
  "/applications",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);



module.exports = adminRoutes;
