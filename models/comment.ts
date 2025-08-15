import { model, models, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isOffensive: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default models.Comment || model("Comment", commentSchema);
