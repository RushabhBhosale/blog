import { Schema, model, models } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default models.Subscriber || model("Subscriber", subscriberSchema);
