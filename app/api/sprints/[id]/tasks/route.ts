import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protectedUser } from "@/lib/api-auth";
import Sprint from "@/models/Sprint";
import Mentorship from "@/models/Mentorship";

const schema = z.object({
  taskId: z.string(),
  status: z.enum(["todo", "in_progress", "review", "done"])
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await protectedUser();
  if (auth.error) return auth.error;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  await connectDB();
  const sprint = await Sprint.findById(params.id);
  if (!sprint) return NextResponse.json({ error: "Sprint não encontrada." }, { status: 404 });
  const mentorship = await Mentorship.findById(sprint.mentorshipId);
  if (!mentorship || ![String(mentorship.mentorId), String(mentorship.menteeId)].includes(String(auth.user._id))) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }
  const task = sprint.tasks.id(parsed.data.taskId);
  if (!task) return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
  task.status = parsed.data.status;
  await sprint.save();
  return NextResponse.json(sprint);
}