const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    roundName: {
      type: String,
      required: true,
      trim: true,
      // Example: "Round 1", "Technical", "HR", "Final"
    },

    roundNumber: {
      type: Number,
      required: true,
    },

    scheduledDate: Date,

    status: {
      type: String,
      enum: ["Pending", "Cleared", "Rejected"],
      default: "Pending",
      index: true,
    },

    attendance: {
      type: String,
      enum: ["Present", "Absent"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // recruiter
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate round for same application
roundSchema.index(
  { application: 1, roundNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Round", roundSchema);
