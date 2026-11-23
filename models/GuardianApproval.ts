import mongoose, { Schema, type Model } from "mongoose";

const GuardianApprovalSchema = new Schema({
  menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  guardianEmail: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  approvedAt: Date,
  status: { type: String, enum: ["pending", "approved", "expired"], default: "pending" }
}, { timestamps: true });

export default (mongoose.models.GuardianApproval as Model<any>) ||
  mongoose.model("GuardianApproval", GuardianApprovalSchema);