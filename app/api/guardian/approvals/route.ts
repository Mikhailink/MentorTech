import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import User from "@/models/User";
import Mentorship from "@/models/Mentorship";

export async function GET() {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  if (auth.user.role !== "guardian") return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  await connectDB();
  const mentees = await User.find({ guardianId: auth.user._id }).select("_id name email");
  const approvals = await Mentorship.find({
    menteeId: { $in: mentees.map((m: any) => m._id) },
    status: "pending_guardian_approval"
  }).populate("mentorId", "name email").populate("menteeId", "name");
  return NextResponse.json(approvals);
}