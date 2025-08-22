import { model, models, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    slug: { type: String, required: true },
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId },
    username: { type: String },
    isOffensive: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default models.Comment || model("Comment", commentSchema);
