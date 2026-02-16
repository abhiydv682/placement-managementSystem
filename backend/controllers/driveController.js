const Drive = require("../models/Drive");
const Company = require("../models/Company");

/* ====================================
   ADMIN - CREATE DRIVE
==================================== */

exports.createDrive = async (req, res) => {
  try {
    const {
      company,
      jobRole,
      description,
      qualification,
      vacancies,
      location,
      package: packageValue,
      deadline,
    } = req.body;

    if (
      !company ||
      !jobRole ||
      !description ||
      !qualification ||
      !vacancies ||
      !location ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const drive = await Drive.create({
      company,
      jobRole,
      description,
      qualification,
      vacancies: Number(vacancies),
      location,
      package: packageValue,
      deadline,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      drive,
    });
  } catch (error) {
    console.error("CREATE DRIVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating drive",
    });
  }
};

/* ====================================
   ADMIN - GET ALL DRIVES
==================================== */

exports.getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate("company", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      drives,
    });
  } catch (error) {
    console.error("GET ALL DRIVES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching drives",
    });
  }
};

/* ====================================
   GET SINGLE DRIVE (DETAIL PAGE)
==================================== */

exports.getSingleDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate("company", "name")
      .populate("createdBy", "name");

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    // Auto expire check
    if (new Date(drive.deadline) < new Date()) {
      drive.isActive = false;
      await drive.save();
    }

    res.json({
      success: true,
      drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drive",
    });
  }
};

/* ====================================
   STUDENT - ACTIVE DRIVES
==================================== */

exports.getActiveDrives = async (req, res) => {
  try {
    const drives = await Drive.find({
      isActive: true,
      deadline: { $gte: new Date() },
    })
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      drives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drives",
    });
  }
};

/* ====================================
   RECRUITER - COMPANY DRIVES
==================================== */

exports.getCompanyDrives = async (req, res) => {
  try {
    const drives = await Drive.find({
      company: req.user.company,
    })
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      drives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drives",
    });
  }
};

/* ====================================
   ADMIN - UPDATE DRIVE
==================================== */

exports.updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    const allowedFields = [
      "jobRole",
      "description",
      "qualification",
      "vacancies",
      "location",
      "package",
      "deadline",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        drive[field] = req.body[field];
      }
    });

    await drive.save();

    res.json({
      success: true,
      message: "Drive updated successfully",
      drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* ====================================
   ADMIN - DELETE DRIVE
==================================== */

exports.deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    await drive.deleteOne();

    res.json({
      success: true,
      message: "Drive deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

exports.getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate("company", "name");

    if (!drive) {
      return res.status(404).json({
        message: "Drive not found",
      });
    }

    res.json({
      success: true,
      drive,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drive",
    });
  }
};
