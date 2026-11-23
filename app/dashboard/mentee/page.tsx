import KanbanSprint from "@/app/components/KanbanSprint";

export default function MenteeDashboard() {
  return <main className="mx-auto max-w-6xl px-6 py-10">
    <p className="text-sm text-zinc-400">Workspace do aluno</p><h1 className="mt-1 text-3xl font-semibold">Sua mentoria</h1>
    <section className="my-8 grid gap-4 md:grid-cols-3">
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Status</p><p className="mt-2 font-medium">Consulte suas sprints</p></article>
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Próxima sessão</p><p className="mt-2 font-medium">Agende com seu mentor</p></article>
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Portfólio</p><p className="mt-2 font-medium">Configure seu username público</p></article>
    </section>
    <h2 className="mb-4 text-lg font-semibold">Sprints</h2><KanbanSprint/>
  </main>;
}