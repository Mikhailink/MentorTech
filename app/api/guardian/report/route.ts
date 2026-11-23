import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import User from "@/models/User";
import Mentorship from "@/models/Mentorship";
import Sprint from "@/models/Sprint";
import CodeReview from "@/models/CodeReview";

export async function GET() {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  if (auth.user.role !== "guardian") return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  await connectDB();
  const mentees = await User.find({ guardianId: auth.user._id }).select("_id name");
  const links = await Mentorship.find({ menteeId: { $in: mentees.map((m: any) => m._id) } }).select("_id menteeId weeklyHours");
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sprints = await Sprint.find({ mentorshipId: { $in: links.map((x: any) => x._id) }, updatedAt: { $gte: since } })
    .select("title goal tasks.updatedAt");
  const reviews = await CodeReview.find({ mentorshipId: { $in: links.map((x: any) => x._id) }, updatedAt: { $gte: since } })
    .select("comments");
  return NextResponse.json({
    weekStarting: since,
    mentees,
    plannedWeeklyHours: links.reduce((sum: number, x: any) => sum + x.weeklyHours, 0),
    topics: sprints.map((s: any) => ({ title: s.title, goal: s.goal })),
    feedbackCount: reviews.reduce((sum: number, r: any) => sum + r.comments.length, 0)
  });
}