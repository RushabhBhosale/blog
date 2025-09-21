import { model, models, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.Category || model("Category", categorySchema);
