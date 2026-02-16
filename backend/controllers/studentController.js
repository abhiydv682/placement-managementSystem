const User = require('../models/User');
const Application = require('../models/Application');

// 1. Get Profile
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('-password');
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Update Profile & Resume
exports.updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Agar file upload hui hai toh Cloudinary URL save karo
        if (req.file) {
            updateData.resumeUrl = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            updateData, 
            { new: true }
        ).select('-password');

        res.json({ message: "Profile Updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Update Failed" });
    }
};

// 3. Apply to Drive
exports.applyToDrive = async (req, res) => {
    const { driveId } = req.body;
    try {
        // Check karo student ne pehle se toh apply nahi kiya
        const alreadyApplied = await Application.findOne({ 
            student: req.user.id, 
            drive: driveId 
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this drive" });
        }

        // Student ki details lo resume check karne ke liye
        const student = await User.findById(req.user.id);
        if (!student.resumeUrl) {
            return res.status(400).json({ message: "Please upload your resume first" });
        }

        const newApplication = await Application.create({
            student: req.user.id,
            drive: driveId,
            resumeUrl: student.resumeUrl,
            status: 'Applied'
        });

        res.status(201).json({ message: "Applied Successfully", newApplication });
    } catch (error) {
        res.status(500).json({ message: "Application Error" });
    }
};

// 4. Get My Applications History
exports.getMyApplications = async (req, res) => {
    try {
        const history = await Application.find({ student: req.user.id })
            .populate('drive', 'companyName jobRole package deadline')
            .sort('-createdAt');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};