import mongoose, { Schema, type Model } from "mongoose";

const CommentSchema = new Schema({
  lineNumber: { type: Number, min: 1 },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
});

const CodeReviewSchema = new Schema({
  mentorshipId: { type: Schema.Types.ObjectId, ref: "Mentorship", required: true, index: true },
  snippetCode: { type: String, required: true, maxlength: 30000 },
  language: { type: String, required: true, maxlength: 40 },
  comments: { type: [CommentSchema], default: [] }
}, { timestamps: true });

export default (mongoose.models.CodeReview as Model<any>) ||
  mongoose.model("CodeReview", CodeReviewSchema);