import CodeSnippetReview from "@/app/components/CodeSnippetReview";

export default function MentorDashboard() {
  return <main className="mx-auto max-w-6xl px-6 py-10">
    <p className="text-sm text-zinc-400">Workspace do mentor</p><h1 className="mt-1 text-3xl font-semibold">Alunos e revisões</h1>
    <section className="my-8 grid gap-4 md:grid-cols-3">
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Mentorias ativas</p><p className="mt-2">Consulte suas mentorias no workspace.</p></article>
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Agenda</p><p className="mt-2">Organize as próximas sessões.</p></article>
      <article className="rounded-lg border border-zinc-800 p-5"><p className="text-sm text-zinc-400">Code review</p><p className="mt-2">Feedback técnico contextualizado.</p></article>
    </section>
    <CodeSnippetReview language="typescript" code={"// Seus exemplos de revisão aparecerão aqui."}/>
  </main>;
}