import mongoose, { Schema, type Model } from "mongoose";

const MentorshipSchema = new Schema({
  mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: {
    type: String,
    enum: ["pending_guardian_approval", "active", "paused", "completed"],
    default: "pending_guardian_approval"
  },
  startDate: Date,
  weeklyHours: { type: Number, min: 0, max: 40, default: 1 },
  currentSprint: { type: Schema.Types.ObjectId, ref: "Sprint" }
}, { timestamps: true });

export default (mongoose.models.Mentorship as Model<any>) ||
  mongoose.model("Mentorship", MentorshipSchema);