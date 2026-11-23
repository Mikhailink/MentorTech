import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import Mentorship from "@/models/Mentorship";
import User from "@/models/User";

const schema = z.object({ mentorshipId: z.string(), decision: z.enum(["approve", "reject"]) });

export async function POST(req: Request) {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  if (auth.user.role !== "guardian") return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  await connectDB();
  const mentees = await User.find({ guardianId: auth.user._id }).distinct("_id");
  const mentorship = await Mentorship.findOne({
    _id: parsed.data.mentorshipId,
    menteeId: { $in: mentees },
    status: "pending_guardian_approval"
  });
  if (!mentorship) return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  mentorship.status = parsed.data.decision === "approve" ? "active" : "paused";
  if (parsed.data.decision === "approve") mentorship.startDate = new Date();
  await mentorship.save();
  return NextResponse.json({ ok: true });
}