"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const columns = [
  ["todo", "A Fazer"], ["in_progress", "Em Progresso"], ["review", "Code Review"], ["done", "Concluído"]
] as const;

export default function KanbanSprint() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["sprints"],
    queryFn: async () => {
      const res = await fetch("/api/sprints");
      if (!res.ok) throw new Error("Não foi possível carregar as sprints.");
      return res.json();
    }
  });
  if (isLoading) return <p className="text-sm text-zinc-400">Carregando sprints…</p>;
  return <div className="grid gap-4 md:grid-cols-4">
    {columns.map(([status, title]) => <section key={status} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="mb-4 text-sm font-medium">{title}</h3>
      {(data as any[]).flatMap(s => s.tasks.filter((t: any) => t.status === status).map((task: any) =>
        <motion.article layout key={task._id} className="mb-2 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm">{task.title}<p className="mt-2 text-xs text-zinc-500">{s.title}</p></motion.article>
      ))}
    </section>)}
  </div>;
}