const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/* =========================
   🔗 COMMON MEDIA SCHEMA
========================= */

const mediaSchema = new mongoose.Schema(
  {
    public_id: String,
    secure_url: String,
  },
  { _id: false }
);

/* =========================
   👤 USER SCHEMA
========================= */

const userSchema = new mongoose.Schema(
  {
    /* ---------- BASIC ---------- */

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      index: true,
      validate: [validator.isEmail, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: String,

    role: {
      type: String,
      enum: ["admin", "student", "recruiter"],
      default: "student",
      index: true,
    },

    /* ---------- STUDENT PROFILE ---------- */

    course: String,
    college: String,
    branch: String,
    cgpa: String,
    batch: String,
    bio: String,
    website: String,
    linkedIn: String,
    github: String,

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ---------- MEDIA ---------- */

    resume: mediaSchema,
    profilePic: mediaSchema,

    /* ---------- RECRUITER ---------- */

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    /* ---------- STATUS ---------- */

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   🔐 PASSWORD HASH MIDDLEWARE
========================= */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   🔑 PASSWORD CHECK
========================= */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* =========================
   🧹 REMOVE PASSWORD FROM RESPONSE
========================= */

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
