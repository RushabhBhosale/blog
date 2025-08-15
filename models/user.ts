import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    role: { type: String },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", userSchema);
