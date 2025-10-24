import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    headline: { type: String },
    bio: { type: String },
    location: { type: String },
    website: { type: String },
    socials: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    role: { type: String },
    isActive: { type: Boolean, default: true },
    // Posting policy: if true, user posts auto‑publish; else require approval
    canAutoPublish: { type: Boolean, default: false },
  },
  { timestamps: true },
);

try {
  userSchema.index({ username: 1 }, { unique: true, sparse: true });
} catch {}

export default models.User || mongoose.model("User", userSchema);
