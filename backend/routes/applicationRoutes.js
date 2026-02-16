const express = require("express");
const applicationRoutes = express.Router();

const {
  applyToDrive,
  getMyApplications,
  getApplicantsForDrive,
  updateApplicationStatus,
  addRound,
  updateRoundStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

/* =========================================
   STUDENT APPLY TO DRIVE
   POST /api/applications/:driveId
========================================= */

applicationRoutes.post(
  "/:driveId",
  protect,
  authorizeRoles("student"),
  applyToDrive
);

/* =========================================
   STUDENT VIEW OWN APPLICATIONS
   GET /api/applications/my
========================================= */

applicationRoutes.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyApplications
);

/* =========================================
   RECRUITER VIEW APPLICANTS
   GET /api/applications/drive/:driveId
========================================= */

applicationRoutes.get(
  "/drive/:driveId",
  protect,
  authorizeRoles("recruiter"),
  getApplicantsForDrive
);

/* =========================================
   RECRUITER UPDATE STATUS
   PUT /api/applications/:applicationId/status
========================================= */

applicationRoutes.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

/* =========================================
   RECRUITER ADD ROUND
   POST /api/applications/:applicationId/round
========================================= */

applicationRoutes.post(
  "/:applicationId/round",
  protect,
  authorizeRoles("recruiter"),
  addRound
);

/* =========================================
   RECRUITER UPDATE ROUND
   PUT /api/applications/:applicationId/round
========================================= */

applicationRoutes.put(
  "/:applicationId/round",
  protect,
  authorizeRoles("recruiter"),
  updateRoundStatus
);

module.exports = applicationRoutes;
