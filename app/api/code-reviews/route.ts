import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import Mentorship from "@/models/Mentorship";
import CodeReview from "@/models/CodeReview";

const schema = z.object({
  mentorshipId: z.string(),
  snippetCode: z.string().min(1).max(30000),
  language: z.string().min(1).max(40),
  comment: z.string().max(2000).optional(),
  lineNumber: z.number().int().positive().optional()
});

export async function GET() {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  await connectDB();
  const links = await Mentorship.find({
    $or: [{ mentorId: auth.user._id }, { menteeId: auth.user._id }]
  }).select("_id");
  const reviews = await CodeReview.find({ mentorshipId: { $in: links.map((x: any) => x._id) } })
    .populate("comments.authorId", "name").sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  await connectDB();
  const link = await Mentorship.findById(parsed.data.mentorshipId);
  if (!link || ![String(link.mentorId), String(link.menteeId)].includes(String(auth.user._id))) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }
  const review = await CodeReview.create({
    mentorshipId: link._id,
    snippetCode: parsed.data.snippetCode,
    language: parsed.data.language,
    comments: parsed.data.comment ? [{
      authorId: auth.user._id, content: parsed.data.comment, lineNumber: parsed.data.lineNumber
    }] : []
  });
  return NextResponse.json(review, { status: 201 });
}