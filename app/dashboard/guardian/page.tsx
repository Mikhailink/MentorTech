"use client";

import { useQuery } from "@tanstack/react-query";

export default function GuardianDashboard() {
  const approvals = useQuery({ queryKey: ["approvals"], queryFn: async () => {
    const r = await fetch("/api/guardian/approvals"); if (!r.ok) throw new Error("Falha"); return r.json();
  }});
  const report = useQuery({ queryKey: ["report"], queryFn: async () => {
    const r = await fetch("/api/guardian/report"); if (!r.ok) throw new Error("Falha"); return r.json();
  }});
  async function decide(mentorshipId: string, decision: "approve" | "reject") {
    await fetch("/api/guardian/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mentorshipId, decision }) });
    await approvals.refetch();
  }
  return <main className="mx-auto max-w-6xl px-6 py-10">
    <p className="text-sm text-zinc-400">Área do responsável</p><h1 className="mt-1 text-3xl font-semibold">Guardian Hub</h1>
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <section className="rounded-lg border border-zinc-800 p-5"><h2 className="font-medium">Aprovações pendentes</h2>
        {(approvals.data ?? []).map((item: any) => <article key={item._id} className="mt-4 border-t border-zinc-800 pt-4 text-sm">
          <p>{item.menteeId?.name} · Mentor: {item.mentorId?.name}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => decide(item._id, "approve")} className="rounded bg-emerald-700 px-3 py-1.5">Aprovar</button>
            <button onClick={() => decide(item._id, "reject")} className="rounded bg-orange-700 px-3 py-1.5">Recusar</button>
          </div>
        </article>)}
      </section>
      <section className="rounded-lg border border-zinc-800 p-5"><h2 className="font-medium">Relatório semanal</h2>
        <p className="mt-3 text-sm text-zinc-400">Horas previstas: {report.data?.plannedWeeklyHours ?? "—"}</p>
        <p className="mt-2 text-sm text-zinc-400">Feedbacks recentes: {report.data?.feedbackCount ?? "—"}</p>
        <ul className="mt-3 text-sm">{report.data?.topics?.map((t: any, i: number) => <li key={i}>{t.title}</li>)}</ul>
      </section>
      <section className="rounded-lg border border-zinc-800 p-5"><h2 className="font-medium">Canal de segurança</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">A plataforma registra mentorias e feedbacks para oferecer transparência. Em caso de preocupação, contate a equipe de suporte da plataforma.</p>
      </section>
    </div>
  </main>;
}