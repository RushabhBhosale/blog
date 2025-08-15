import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", userSchema);
