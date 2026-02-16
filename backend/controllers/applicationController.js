const Application = require("../models/Application");
const Drive = require("../models/Drive");
const asyncHandler = require("../utils/asyncHandler");
const Notification = require("../models/Notification");

/* =========================================
   STUDENT APPLY TO DRIVE
========================================= */

// exports.applyToDrive = asyncHandler(async (req, res) => {
//   const { driveId } = req.params;

//   const drive = await Drive.findById(driveId);

//   if (!drive) {
//     return res.status(404).json({
//       message: "Drive not found",
//     });
//   }

//   // Deadline check
//   if (drive.deadline < new Date()) {
//     return res.status(400).json({
//       message: "Drive deadline expired",
//     });
//   }

//   // Prevent duplicate apply
//   const alreadyApplied = await Application.findOne({
//     student: req.user._id,
//     drive: driveId,
//   });

//   if (alreadyApplied) {
//     return res.status(400).json({
//       message: "You have already applied",
//     });
//   }

//   const application = await Application.create({
//     student: req.user._id,
//     drive: drive._id,
//     company: drive.company,
//     status: "Applied",
//   });

//   res.status(201).json({
//     success: true,
//     application,
//   });
// });

exports.applyToDrive = async (req, res) => {
  try {
    // ✅ FIXED — get from params
    const { driveId } = req.params;

    if (!driveId) {
      return res.status(400).json({
        message: "Drive ID is required",
      });
    }

    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        message: "Drive not found",
      });
    }

    if (drive.deadline < new Date()) {
      return res.status(400).json({
        message: "Drive has expired",
      });
    }

    // ✅ Prevent duplicate application
    const alreadyApplied =
      await Application.findOne({
        student: req.user._id,
        drive: driveId,
      });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied",
      });
    }

    const application =
      await Application.create({
        student: req.user._id,
        drive: drive._id,
        company: drive.company,
      });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "APPLY ERROR:",
      error
    );
    res.status(500).json({
      message: "Server error while applying",
    });
  }
};


/* =========================================
   STUDENT VIEW MY APPLICATIONS
========================================= */

exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    student: req.user._id,
  })
    .populate("drive", "jobRole deadline location")
    .populate("company", "name")
    .sort({ createdAt: -1 });

  res.json(applications);
});

/* =========================================
   RECRUITER VIEW APPLICANTS
========================================= */

exports.getApplicantsForDrive = asyncHandler(async (req, res) => {
  const { driveId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const count = await Application.countDocuments({
    drive: driveId,
  });

  const applications = await Application.find({
    drive: driveId,
  })
    .populate("student", "name email course college")
    .skip(limit * (page - 1))
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    applications,
    page,
    totalPages: Math.ceil(count / limit),
  });
});

/* =========================================
   RECRUITER UPDATE APPLICATION STATUS
========================================= */

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "Applied",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Rejected",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status value",
    });
  }

  const application = await Application.findById(req.params.applicationId);

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  application.status = status;
  await application.save();

  /* 🔔 Create Notification */

  await Notification.create({
    recipient: application.student,
    title: "Application Status Updated",
    message: `Your application status is now ${status}`,
    link: "/student/applications",
  });

  res.json({
    success: true,
    message: "Status updated successfully",
  });
});

/* =========================================
   RECRUITER ADD INTERVIEW ROUND
========================================= */

exports.addRound = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { roundNumber, name, scheduledDate } = req.body;

  if (!roundNumber || !name || !scheduledDate) {
    return res.status(400).json({
      message: "All round fields required",
    });
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  // Prevent duplicate round number
  const existingRound = application.rounds.find(
    (r) => r.roundNumber === Number(roundNumber)
  );

  if (existingRound) {
    return res.status(400).json({
      message: "Round already exists",
    });
  }

  application.rounds.push({
    roundNumber: Number(roundNumber),
    name,
    scheduledDate,
    status: "Pending",
  });

  application.status = "Interview Scheduled";

  await application.save();

  res.json({
    success: true,
    message: "Round added successfully",
    application,
  });
});

/* =========================================
   RECRUITER UPDATE ROUND STATUS
========================================= */

exports.updateRoundStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { roundNumber, status, attendance, rating, notes } = req.body;

  const application = await Application.findById(applicationId);

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  const round = application.rounds.find(
    (r) => r.roundNumber === Number(roundNumber)
  );

  if (!round) {
    return res.status(404).json({
      message: "Round not found",
    });
  }

  if (status) round.status = status;
  if (attendance) round.attendance = attendance;
  if (rating) round.rating = rating;
  if (notes) round.notes = notes;

  await application.save();

  res.json({
    success: true,
    message: "Round updated successfully",
    application,
  });
});
