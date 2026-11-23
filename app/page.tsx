import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const actions = [
  ["Aluno", "/auth/register?role=mentee"],
  ["Mentor", "/auth/register?role=mentor"],
  ["Responsável", "/auth/login"]
];

export default function Home() {
  return <main className="mx-auto max-w-6xl px-6">
    <section className="grid gap-12 py-24 md:grid-cols-[1.3fr_.7fr] md:items-center">
      <div>
        <p className="mb-4 text-sm font-medium text-emerald-400">DESENVOLVIMENTO PROFISSIONAL EM TECNOLOGIA</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">Aprenda com quem já construiu.</h1>
        <p className="mt-6 max-w-2xl leading-7 text-zinc-400">Mentoria individual, projetos práticos e feedback de profissionais experientes — com supervisão parental obrigatória para menores.</p>
        <div className="mt-8 flex flex-wrap gap-3">{actions.map(([label, href]) =>
          <Link key={label} href={href} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-medium hover:bg-emerald-600">{label}<ArrowRight className="ml-2 inline" size={16}/></Link>
        )}</div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-7">
        <ShieldCheck className="text-emerald-500" size={28}/><h2 className="mt-5 text-lg font-semibold">Segurança como requisito</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Contas de menores permanecem bloqueadas no servidor até que um responsável aprove o acesso pelo link enviado por e-mail.</p>
      </div>
    </section>
  </main>;
}