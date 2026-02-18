


// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const asyncHandler = require("../utils/asyncHandler");

// /* ==========================================
//    COOKIE HELPER
// ========================================== */

// const sendTokenCookie = (res, user) => {
//   const token = generateToken(user._id, user.role);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite:
//       process.env.NODE_ENV === "production"
//         ? "None"
//         : "Lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// };

// /* ==========================================
//    REGISTER
// ========================================== */

// exports.register = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields are required",
//     });
//   }

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     return res.status(400).json({
//       success: false,
//       message: "User already exists",
//     });
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   sendTokenCookie(res, user);

//   res.status(201).json({
//     success: true,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });

// /* ==========================================
//    LOGIN
// ========================================== */

// exports.login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select(
//     "+password"
//   );

//   if (!user || !(await user.matchPassword(password))) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid credentials",
//     });
//   }

//   sendTokenCookie(res, user);

//   res.json({
//     success: true,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });

// /* ==========================================
//    LOGOUT
// ========================================== */

// exports.logout = asyncHandler(async (req, res) => {
//   res.cookie("token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite:
//       process.env.NODE_ENV === "production"
//         ? "None"
//         : "Lax",
//     expires: new Date(0),
//   });

//   res.json({
//     success: true,
//     message: "Logged out successfully",
//   });
// });

// /* ==========================================
//    GET CURRENT USER
// ========================================== */

// exports.getCurrentUser = asyncHandler(
//   async (req, res) => {
//     res.json({
//       success: true,
//       user: req.user,
//     });
//   }
// );

// /* ==========================================
//    UPDATE PROFILE (DISK STORAGE VERSION)
// ========================================== */

// // exports.updateProfile = asyncHandler(
// //   async (req, res) => {
// //     const {
// //       phone,
// //       course,
// //       college,
// //       skills,
// //       bio,
// //       website,
// //       linkedIn,
// //       github,
// //     } = req.body;

// //     const user = await User.findById(req.user._id);

// //     if (!user) {
// //       return res.status(404).json({
// //         message: "User not found",
// //       });
// //     }

// //     /* -------- BASIC INFO -------- */

// //     user.phone = phone ?? user.phone;
// //     user.course = course ?? user.course;
// //     user.college = college ?? user.college;
// //     user.bio = bio ?? user.bio;
// //     user.website = website ?? user.website;
// //     user.linkedIn = linkedIn ?? user.linkedIn;
// //     user.github = github ?? user.github;

// //     /* -------- SKILLS FIX -------- */

// //     if (skills) {
// //       if (Array.isArray(skills)) {
// //         user.skills = skills;
// //       } else if (typeof skills === "string") {
// //         user.skills = skills
// //           .split(",")
// //           .map((s) => s.trim());
// //       }
// //     }

// //     /* -------- RESUME UPLOAD -------- */

// //     if (req.file) {
// //       user.resume = {
// //         public_id: req.file.filename,
// //         secure_url: `/uploads/${req.file.filename}`,
// //       };
// //     }

// //     user.profileCompleted = true;

// //     await user.save();

// //     res.json({
// //       success: true,
// //       message: "Profile updated successfully",
// //       user,
// //     });
// //   }
// // );

// exports.updateProfile = asyncHandler(async (req, res) => {
//   const {
//     phone,
//     course,
//     college,
//     skills,
//     bio,
//     website,
//     linkedIn,
//     github,
//   } = req.body;

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }

//   /* =============================
//      BASIC INFO UPDATE
//   ============================== */

//   if (phone !== undefined) user.phone = phone;
//   if (course !== undefined) user.course = course;
//   if (college !== undefined) user.college = college;
//   if (bio !== undefined) user.bio = bio;
//   if (website !== undefined) user.website = website;
//   if (linkedIn !== undefined) user.linkedIn = linkedIn;
//   if (github !== undefined) user.github = github;

//   /* =============================
//      SKILLS HANDLING
//   ============================== */

//   if (skills !== undefined) {
//     if (Array.isArray(skills)) {
//       user.skills = skills.filter(Boolean);
//     } else if (typeof skills === "string") {
//       user.skills = skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0);
//     }
//   }

//   /* =============================
//      FILE UPLOAD (upload.fields)
//   ============================== */

//   if (req.files) {
//     // Resume Upload
//     if (req.files.resume?.length > 0) {
//       const resumeFile = req.files.resume[0];

//       user.resume = {
//         public_id: resumeFile.filename,
//         secure_url: `/uploads/${resumeFile.filename}`,
//       };
//     }

//     // Profile Picture Upload
//     if (req.files.profilePic?.length > 0) {
//       const imageFile = req.files.profilePic[0];

//       user.profilePic = {
//         public_id: imageFile.filename,
//         secure_url: `/uploads/${imageFile.filename}`,
//       };
//     }
//   }

//   user.profileCompleted = true;

//   await user.save();

//   return res.status(200).json({
//     success: true,
//     message: "Profile updated successfully",
//     user,
//   });
// });





const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

/* ==========================================
    COOKIE HELPER
========================================== */
// const sendTokenCookie = (res, user) => {
//   const token = generateToken(user._id, user.role);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// };

const sendTokenCookie = (res, user) => {
  const token = generateToken(user._id, user.role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,          // FORCE TRUE
    sameSite: "None",      // FORCE NONE
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ==========================================
    AUTH OPERATIONS
========================================== */

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body; // Accept role
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  // Allow only 'student' or 'recruiter' during public signup to prevent 'admin' creation
  const assignedRole = (role === "recruiter") ? "recruiter" : "student";

  const user = await User.create({ name, email, password, role: assignedRole });
  sendTokenCookie(res, user);

  res.status(201).json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  sendTokenCookie(res, user);
  res.json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.logout = asyncHandler(async (req, res) => {
 res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(0),
});

  // res.cookie("token", "", {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  //   expires: new Date(0),
  // });
  res.json({ success: true, message: "Logged out successfully" });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  // Frontend calls this to auto-fill the profile form
  res.json({ success: true, user: req.user });
});

/* ==========================================
    UPDATE PROFILE (Placement Ready)
========================================== */

exports.updateProfile = asyncHandler(async (req, res) => {
  const {
    phone, course, college, branch, cgpa, batch,
    skills, bio, website, linkedIn, github,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  /* --- BASIC & PLACEMENT INFO --- */
  if (req.body.name) user.name = req.body.name;
  if (phone !== undefined) user.phone = phone;
  if (course !== undefined) user.course = course;
  if (college !== undefined) user.college = college;
  if (branch !== undefined) user.branch = branch;
  if (cgpa !== undefined) user.cgpa = cgpa;
  if (batch !== undefined) user.batch = batch;
  if (bio !== undefined) user.bio = bio;
  if (website !== undefined) user.website = website;
  if (linkedIn !== undefined) user.linkedIn = linkedIn;
  if (github !== undefined) user.github = github;

  /* --- SKILLS HANDLING --- */
  if (skills !== undefined) {
    if (Array.isArray(skills)) {
      user.skills = skills.filter(Boolean);
    } else if (typeof skills === "string") {
      // Handle potential JSON string from FormData or comma-separated list
      try {
        const parsed = JSON.parse(skills);
        user.skills = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        user.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
      }
    }
  }

  /* --- FILE UPLOAD HANDLING --- */
  if (req.files) {
    if (req.files.resume?.length > 0) {
      user.resume = {
        public_id: req.files.resume[0].filename,
        secure_url: `/uploads/${req.files.resume[0].filename}`,
      };
    }
    if (req.files.profilePic?.length > 0) {
      user.profilePic = {
        public_id: req.files.profilePic[0].filename,
        secure_url: `/uploads/${req.files.profilePic[0].filename}`,
      };
    }
  }

  user.profileCompleted = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});