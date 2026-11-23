import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function OnboardingLocked() {
  return <main className="mx-auto max-w-xl px-6 py-24">
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
      <ShieldCheck className="text-emerald-500" size={32}/>
      <h1 className="mt-5 text-2xl font-semibold">Aguardando aprovação</h1>
      <p className="mt-3 leading-7 text-zinc-400">Como você tem menos de 18 anos, seu acesso às funcionalidades da plataforma está bloqueado até que o responsável confirme a autorização pelo link enviado ao e-mail cadastrado.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => location.reload()} className="rounded-md bg-emerald-700 px-4 py-2 text-sm">Verificar novamente</button>
        <Link href="/auth/login" className="rounded-md border border-zinc-700 px-4 py-2 text-sm">Sou o responsável</Link>
      </div>
    </section>
  </main>;
}