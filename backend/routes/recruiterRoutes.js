const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAssignedDrives,
    getDriveApplicants,
    updateCandidateStage,
    getApplicationDetails,
    getRecentApplications
} = require('../controllers/recruiterController');

router.use(protect, authorize('recruiter'));

// 0. Dashboard Stats & Recent Activity
router.get('/recent-applications', getRecentApplications);

// 1. Recruiter ko kaunsi companies/drives mili hain
router.get('/my-drives', getAssignedDrives);

// 2. Ek specific drive ke saare students dekhna
router.get('/drive/:driveId/applicants', getDriveApplicants);

// 3. Single Application Detail
router.get('/application/:applicationId', getApplicationDetails);

// 4. Update Status (Synced with Frontend)
router.put('/application/:applicationId/stage', updateCandidateStage);

module.exports = router;