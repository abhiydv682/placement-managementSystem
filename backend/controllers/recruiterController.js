const mongoose = require('mongoose');
const Application = require('../models/Application');
const Drive = require('../models/Drive');

// 1. Recruiter ko assigned placement drives dikhana
// 1. Recruiter ko assigned placement drives dikhana (with applicant count)
exports.getAssignedDrives = async (req, res) => {
    try {
        // Debug Log
        console.log("LOGGED IN USER:", req.user._id, req.user.name, req.user.role);
        console.log("USER COMPANY:", req.user.company);

        const matchQuery = {
            $or: [
                { createdBy: new mongoose.Types.ObjectId(String(req.user._id)) }
            ]
        };

        if (req.user.company) {
            matchQuery.$or.push({
                company: new mongoose.Types.ObjectId(String(req.user.company))
            });
        }

        console.log("MATCH QUERY:", JSON.stringify(matchQuery, null, 2));

        const drives = await Drive.aggregate([
            {
                $match: matchQuery
            },
            // ... (rest of pipeline)
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "drive",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: "$applications" }
                }
            },
            {
                $project: {
                    applications: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(drives);
    } catch (error) {
        console.error("Error fetching drives:", error);
        res.status(500).json({ message: "Drives fetch karne mein error hai" });
    }
};

/* ============================
   4. Get Single Application Detail
============================ */
exports.getApplicationDetails = async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId)
            .populate('student', 'name email phone course college branch cgpa batch bio linkedIn github website skills resume profilePic');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error fetching application details:", error);
        res.status(500).json({ message: "Error fetching application details" });
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

/* ============================
   5. Get Recent Applications (Dashboard)
============================ */
exports.getRecentApplications = async (req, res) => {
    try {
        // 1. Find drives created by this recruiter OR linked to their company
        const matchQuery = {
            $or: [
                { createdBy: new mongoose.Types.ObjectId(String(req.user._id)) }
            ]
        };

        if (req.user.company) {
            matchQuery.$or.push({
                company: new mongoose.Types.ObjectId(String(req.user.company))
            });
        }

        const drives = await Drive.find(matchQuery).select('_id');
        const driveIds = drives.map(d => d._id);

        // 2. Find applications for these drives, sorted by latest
        const applications = await Application.find({ drive: { $in: driveIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('student', 'name email profilePic')
            .populate('drive', 'jobRole company');

        res.json(applications);
    } catch (error) {
        console.error("Error fetching recent applications:", error);
        res.status(500).json({ message: "Error fetching recent applications" });
    }
};