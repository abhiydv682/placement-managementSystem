const Company = require("../models/Company");
const User = require("../models/User");
const Drive = require("../models/Drive");
const Application = require("../models/Application");

/* =========================
   CREATE COMPANY
========================= */

exports.createCompany = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);
    res.status(500).json({
      message: "Error creating company",
    });
  }
};

/* =========================
   CREATE RECRUITER
========================= */

exports.createRecruiter = async (req, res) => {
  try {
    const { name, email, password, companyId } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const company =
      await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const recruiter = await User.create({
      name,
      email,
      password,
      role: "recruiter",
      company: companyId,
    });

    // ✅ PUSH INTO recruiters ARRAY
    await Company.findByIdAndUpdate(companyId, {
      $push: { recruiters: recruiter._id },
    });

    res.status(201).json({
      success: true,
      recruiter,
    });
  } catch (error) {
    console.error("CREATE RECRUITER ERROR:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }
    res.status(500).json({
      message: "Error creating recruiter",
    });
  }
};

/* =========================
   GET ALL COMPANIES
========================= */

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("recruiters", "name email")
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    console.error("COMPANY FETCH ERROR:", error);
    res.status(500).json({
      message: "Error fetching companies",
    });
  }
};

/* =========================
   UPDATE COMPANY
========================= */

exports.updateCompany = async (req, res) => {
  try {
    const { name, email } = req.body;

    const company =
      await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (name) company.name = name;

    await company.save();

    // ✅ Update first recruiter email (if exists)
    if (email && company.recruiters.length > 0) {
      await User.findByIdAndUpdate(
        company.recruiters[0],
        { email }
      );
    }

    res.json({
      success: true,
      message: "Company updated",
    });
  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);
    res.status(500).json({
      message: "Error updating company",
    });
  }
};

/* =========================
   DELETE COMPANY
========================= */

exports.deleteCompany = async (req, res) => {
  try {
    const company =
      await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // ✅ Delete all recruiters linked to this company
    await User.deleteMany({
      _id: { $in: company.recruiters },
    });

    // Delete related drives
    await Drive.deleteMany({
      company: company._id,
    });

    // Delete related applications
    await Application.deleteMany({
      company: company._id,
    });

    await company.deleteOne();

    res.json({
      success: true,
      message: "Company deleted",
    });
  } catch (error) {
    console.error("DELETE COMPANY ERROR:", error);
    res.status(500).json({
      message: "Error deleting company",
    });
  }
};

/* =========================
   ADMIN DASHBOARD STATS
========================= */

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalCompanies =
      await Company.countDocuments();

    const totalDrives =
      await Drive.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const selectedCount =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejectedCount =
      await Application.countDocuments({
        status: "Rejected",
      });

    res.json({
      totalStudents,
      totalCompanies,
      totalDrives,
      totalApplications,
      selectedCount,
      rejectedCount,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({
      message: "Error loading dashboard",
    });
  }
};


/* =========================
   GET SINGLE COMPANY DETAILS
========================= */

exports.getCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    ).populate("recruiters", "name email createdAt");

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json(company);
  } catch (error) {
    console.error("COMPANY DETAILS ERROR:", error);
    res.status(500).json({
      message: "Error fetching company details",
    });
  }
};

/* =========================
   REMOVE RECRUITER
========================= */

exports.removeRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const recruiter = await User.findById(
      recruiterId
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    const companyId = recruiter.company;

    // Remove recruiter from company
    await Company.findByIdAndUpdate(
      companyId,
      {
        $pull: { recruiters: recruiterId },
      }
    );

    await recruiter.deleteOne();

    res.json({
      success: true,
      message: "Recruiter removed",
    });
  } catch (error) {
    console.error("REMOVE RECRUITER ERROR:", error);
    res.status(500).json({
      message: "Error removing recruiter",
    });
  }
};


/* =========================
   RECRUITER STATS
========================= */

exports.getRecruiterStats = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const recruiter = await User.findById(
      recruiterId
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    // Drives created for this company
    const totalDrives =
      await Drive.countDocuments({
        company: recruiter.company,
      });

    // Applications under this company
    const totalApplications =
      await Application.countDocuments({
        company: recruiter.company,
      });

    const selected =
      await Application.countDocuments({
        company: recruiter.company,
        status: "Selected",
      });

    const rejected =
      await Application.countDocuments({
        company: recruiter.company,
        status: "Rejected",
      });

    const selectionRate =
      totalApplications > 0
        ? (
          (selected / totalApplications) *
          100
        ).toFixed(1)
        : 0;

    res.json({
      totalDrives,
      totalApplications,
      selected,
      rejected,
      selectionRate,
    });
  } catch (error) {
    console.error("RECRUITER STATS ERROR:", error);
    res.status(500).json({
      message: "Error loading recruiter stats",
    });
  }
};


/* =========================
   RECRUITER RANKING
========================= */

exports.getRecruiterRanking = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
    });

    const ranking = await Promise.all(
      recruiters.map(async (rec) => {
        const selected =
          await Application.countDocuments({
            company: rec.company,
            status: "Selected",
          });

        return {
          _id: rec._id,
          name: rec.name,
          selected,
        };
      })
    );

    ranking.sort(
      (a, b) => b.selected - a.selected
    );

    res.json(ranking);
  } catch (error) {
    res.status(500).json({
      message: "Error loading ranking",
    });
  }
};


/* =========================
   DRIVE WISE ANALYTICS
========================= */

exports.getDriveAnalytics = async (req, res) => {
  try {
    const drives = await Drive.find();

    const data = await Promise.all(
      drives.map(async (drive) => {
        const total =
          await Application.countDocuments({
            drive: drive._id,
          });

        const selected =
          await Application.countDocuments({
            drive: drive._id,
            status: "Selected",
          });

        return {
          drive: drive.jobRole,
          total,
          selected,
        };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Drive analytics error",
    });
  }
};



/* =========================
   GET ALL APPLICATIONS (ADMIN)
========================= */

exports.getAllApplications = async (req, res) => {
  try {
    const applications =
      await Application.find()
        .populate("student", "name email resume")
        .populate("drive", "jobRole")
        .populate("company", "name")
        .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("APPLICATION FETCH ERROR:", error);
    res.status(500).json({
      message: "Error fetching applications",
    });
  }
};
