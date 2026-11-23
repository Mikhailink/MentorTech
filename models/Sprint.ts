import mongoose, { Schema, type Model } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  status: { type: String, enum: ["todo", "in_progress", "review", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
}, { _id: true });

const SprintSchema = new Schema({
  mentorshipId: { type: Schema.Types.ObjectId, ref: "Mentorship", required: true, index: true },
  title: { type: String, required: true, maxlength: 120 },
  goal: { type: String, required: true, maxlength: 1000 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: { type: [TaskSchema], default: [] }
}, { timestamps: true });

export default (mongoose.models.Sprint as Model<any>) || mongoose.model("Sprint", SprintSchema);