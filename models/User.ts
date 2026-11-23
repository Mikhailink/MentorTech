import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ["mentee", "mentor", "guardian"], required: true },
  age: { type: Number, min: 13, max: 120 },
  isMinor: { type: Boolean, default: false },
  guardianEmail: { type: String, lowercase: true, trim: true },
  guardianId: { type: Schema.Types.ObjectId, ref: "User" },
  isGuardianApproved: { type: Boolean, default: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  avatarUrl: String,
  bio: { type: String, maxlength: 1000, default: "" },
  technologies: { type: [String], default: [] }
}, { timestamps: { createdAt: true, updatedAt: false } });

export type UserDocument = InferSchemaType<typeof UserSchema>;
export default (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);