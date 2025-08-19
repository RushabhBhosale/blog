import { model, models, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, required: true },
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
