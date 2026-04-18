const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    repoUrl: {
      type: String,
      default: null,
      trim: true,
    },
    repoSlug: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    statusCode: {
      type: Number,
      required: true,
      default: 200,
    },
    durationMs: {
      type: Number,
      required: true,
      default: 0,
    },
    fromCache: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ userId: 1, repoSlug: 1, createdAt: -1 });

module.exports = mongoose.model("UserActivity", userActivitySchema);
