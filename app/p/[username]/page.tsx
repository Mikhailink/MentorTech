import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Mentorship from "@/models/Mentorship";
import Sprint from "@/models/Sprint";

export default async function Portfolio({ params }: { params: { username: string } }) {
  await connectDB();
  const user = await User.findOne({ username: params.username, role: "mentee" }).select("name bio avatarUrl technologies _id").lean() as any;
  if (!user) notFound();
  const links = await Mentorship.find({ menteeId: user._id, status: "completed" }).select("_id");
  const sprints = await Sprint.find({ mentorshipId: { $in: links.map((x: any) => x._id) } }).select("title goal").lean() as any[];
  return <main className="mx-auto max-w-3xl px-6 py-16">
    <div className="flex items-center gap-5">
      {user.avatarUrl && <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover"/>}
      <div><h1 className="text-3xl font-semibold">{user.name}</h1><p className="mt-2 text-zinc-400">{user.bio}</p></div>
    </div>
    <div className="my-6 flex flex-wrap gap-2">{user.technologies.map((t: string) => <span key={t} className="rounded-full border border-zinc-700 px-3 py-1 text-sm">{t}</span>)}</div>
    <h2 className="mb-4 text-lg font-semibold">Sprints concluídas</h2>
    <div className="grid gap-3">{sprints.map((s: any) => <article key={s._id} className="rounded-lg border border-zinc-800 p-5"><h3 className="font-medium">{s.title}</h3><p className="mt-2 text-sm text-zinc-400">{s.goal}</p></article>)}</div>
  </main>;
}