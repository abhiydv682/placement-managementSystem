const mongoose = require("mongoose");

/* ================= ROUND SUB-SCHEMA ================= */

const roundSchema = new mongoose.Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledDate: {
      type: Date,
    },

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

    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/* ================= MAIN APPLICATION SCHEMA ================= */

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
      index: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
        "On Hold",
      ],
      default: "Applied",
      index: true,
    },

    currentRound: {
      type: String,
      default: null,
    },

    currentRoundNumber: {
      type: Number,
      default: 0,
    },

    rounds: {
      type: [roundSchema],
      default: [],
    },

    finalStage: {
      loiIssued: {
        type: Boolean,
        default: false,
      },
      offerReleased: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

/* ================= UNIQUE INDEX ================= */
/* Prevent duplicate application */

applicationSchema.index(
  { student: 1, drive: 1 },
  { unique: true }
);

/* ================= PERFORMANCE INDEX ================= */

applicationSchema.index({ company: 1, status: 1 });

/* ================= PRE-SAVE MIDDLEWARE ================= */

// applicationSchema.pre("save", function (next) {
//   try {
//     // Update current round automatically
//     if (Array.isArray(this.rounds) && this.rounds.length > 0) {
//       const latestRound = this.rounds[this.rounds.length - 1];

//       this.currentRound = latestRound.name;
//       this.currentRoundNumber = latestRound.roundNumber;

//       // Auto reject if latest round rejected
//       if (latestRound.status === "Rejected") {
//         this.status = "Rejected";
//       }

//       // If cleared and last round cleared → mark selected (optional logic)
//       const allCleared = this.rounds.every(
//         (r) => r.status === "Cleared"
//       );

//       if (allCleared && this.rounds.length > 0) {
//         this.status = "Selected";
//       }
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });
applicationSchema.pre("save", async function () {
  // If rounds exist
  if (Array.isArray(this.rounds) && this.rounds.length > 0) {
    const latestRound = this.rounds[this.rounds.length - 1];

    this.currentRound = latestRound.name;
    this.currentRoundNumber = latestRound.roundNumber;

    // Auto reject
    if (latestRound.status === "Rejected") {
      this.status = "Rejected";
    }

    // Auto select if all cleared
    const allCleared = this.rounds.every(
      (r) => r.status === "Cleared"
    );

    if (allCleared) {
      this.status = "Selected";
    }
  }
});

module.exports = mongoose.model(
  "Application",
  applicationSchema
);
