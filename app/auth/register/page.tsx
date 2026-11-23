"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  async function submit(form: FormData) {
    setError(""); setDone("");
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Erro ao cadastrar.");
    else setDone(data.waitingForGuardian
      ? "Cadastro criado. A conta será liberada após a aprovação do responsável enviada por e-mail."
      : "Cadastro concluído. Você já pode entrar.");
  }
  return <main className="mx-auto max-w-md px-6 py-12">
    <h1 className="text-2xl font-semibold">Criar conta</h1>
    <form action={submit} className="mt-6 grid gap-4">
      <input name="name" placeholder="Nome completo" required/>
      <input name="email" type="email" placeholder="E-mail" required/>
      <input name="password" type="password" minLength={10} placeholder="Senha (mínimo 10 caracteres)" required/>
      <select name="role" defaultValue={params.get("role") === "mentor" ? "mentor" : "mentee"}>
        <option value="mentee">Aluno</option><option value="mentor">Mentor</option>
      </select>
      <input name="age" type="number" min="13" max="120" placeholder="Idade" required/>
      <input name="guardianEmail" type="email" placeholder="E-mail do responsável (obrigatório para menores)"/>
      {error && <p className="text-sm text-orange-400">{error}</p>}
      {done && <p className="text-sm text-emerald-400">{done}</p>}
      <button className="rounded-md bg-emerald-700 px-4 py-2 font-medium">Cadastrar</button>
    </form>
  </main>;
}