const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getAssignedDrives, 
    getDriveApplicants, 
    updateCandidateStage 
} = require('../controllers/recruiterController');

router.use(protect, authorize('recruiter'));

// 1. Recruiter ko kaunsi companies/drives mili hain
router.get('/my-drives', getAssignedDrives);

// 2. Ek specific drive ke saare students dekhna
router.get('/drive/:driveId/applicants', getDriveApplicants);

// 3. Candidate ka status, round aur rating update karna
router.put('/update-status/:applicationId', updateCandidateStage);

module.exports = router;