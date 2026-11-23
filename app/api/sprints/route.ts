import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import Mentorship from "@/models/Mentorship";
import Sprint from "@/models/Sprint";

const schema = z.object({
  mentorshipId: z.string(),
  title: z.string().min(2).max(120),
  goal: z.string().min(2).max(1000),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  tasks: z.array(z.object({
    title: z.string().min(1).max(200),
    priority: z.enum(["low", "medium", "high"]).default("medium")
  })).default([])
});

export async function GET() {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  await connectDB();
  const filter = auth.user.role === "mentor"
    ? { mentorId: auth.user._id }
    : auth.user.role === "mentee" ? { menteeId: auth.user._id } : null;
  if (!filter) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  const mentorships = await Mentorship.find({ ...filter, status: { $in: ["active", "completed"] } }).select("_id");
  const sprints = await Sprint.find({ mentorshipId: { $in: mentorships.map((m: any) => m._id) } }).sort({ startDate: -1 });
  return NextResponse.json(sprints);
}

export async function POST(req: Request) {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  await connectDB();
  const mentorship = await Mentorship.findById(parsed.data.mentorshipId);
  if (!mentorship || ![String(mentorship.mentorId), String(mentorship.menteeId)].includes(String(auth.user._id))) {
    return NextResponse.json({ error: "Mentoria não encontrada." }, { status: 404 });
  }
  const sprint = await Sprint.create(parsed.data);
  return NextResponse.json(sprint, { status: 201 });
}