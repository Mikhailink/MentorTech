import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GuardianApproval from "@/models/GuardianApproval";
import User from "@/models/User";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token ausente." }, { status: 400 });
  await connectDB();
  const approval = await GuardianApproval.findOne({ token, status: "pending", expiresAt: { $gt: new Date() } });
  if (!approval) return NextResponse.json({ error: "Link inválido, expirado ou já utilizado." }, { status: 410 });

  const guardian = await User.findOneAndUpdate(
    { email: approval.guardianEmail },
    { $setOnInsert: { name: "Responsável", email: approval.guardianEmail, role: "guardian", isMinor: false, isGuardianApproved: true } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await User.findByIdAndUpdate(approval.menteeId, {
    $set: { isGuardianApproved: true, guardianId: guardian._id }
  });
  approval.status = "approved";
  approval.approvedAt = new Date();
  await approval.save();
  return NextResponse.redirect(new URL("/auth/login?guardianApproved=1", req.url));
}