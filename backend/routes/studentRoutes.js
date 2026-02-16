const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary'); // Resume upload setup
const { 
    applyToDrive, 
    getMyApplications, 
    updateProfile, 
    getStudentProfile 
} = require('../controllers/studentController');

// Saare routes Student role ke liye protected hain
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);

// 'resume' field name frontend se matching hona chahiye
router.put('/update-profile', upload.single('resume'), updateProfile);
router.post('/apply', applyToDrive);
router.get('/my-applications', getMyApplications);

module.exports = router;