const Application = require('../models/Application');
const Drive = require('../models/Drive');

// 1. Recruiter ko assigned placement drives dikhana
exports.getAssignedDrives = async (req, res) => {
    try {
        // Recruiter wahi drives dekhega jahan uski company assigned hai
        const drives = await Drive.find({ assignedRecruiter: req.user.id });
        res.json(drives);
    } catch (error) {
        res.status(500).json({ message: "Drives fetch karne mein error hai" });
    }
};

// 2. Ek specific drive ke saare applicants ki details (Profile + Resume)
exports.getDriveApplicants = async (req, res) => {
    try {
        const applicants = await Application.find({ drive: req.params.driveId })
            .populate('student', 'name email phone course skills resumeUrl')
            .sort('-createdAt');
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ message: "Applicants list nahi mil rahi" });
    }
};

// 3. Candidate ka status, round, rating aur notes update karna (Main Feature)
exports.updateCandidateStage = async (req, res) => {
    try {
        const { 
            status,          // Shortlisted, Selected, Rejected, etc.
            currentRound,    // Round 1, Round 2, HR, Final
            attendance,      // Present / Absent
            recruiterNotes, 
            rating,          // Stars (1-5)
            loiIssued, 
            offerReleased 
        } = req.body;

        const updatedApp = await Application.findByIdAndUpdate(
            req.params.applicationId,
            { 
                status, 
                currentRound, 
                attendance, 
                recruiterNotes, 
                rating,
                // Offer details update karne ke liye
                'offerDetails.loiIssued': loiIssued,
                'offerDetails.offerReleased': offerReleased
            },
            { new: true }
        ).populate('student', 'name email');

        res.json({ 
            message: `Status updated for ${updatedApp.student.name}`, 
            updatedApp 
        });
    } catch (error) {
        res.status(500).json({ message: "Update fail ho gaya" });
    }
};