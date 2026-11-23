"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  async function submit(form: FormData) {
    const result = await signIn("credentials", {
      email: form.get("email"), password: form.get("password"), redirect: false
    });
    if (result?.error) setError("E-mail ou senha inválidos.");
    else window.location.href = "/dashboard";
  }
  return <main className="mx-auto max-w-md px-6 py-16">
    <h1 className="text-2xl font-semibold">Entrar</h1>
    <p className="mt-2 text-sm text-zinc-400">Acesse sua conta MentorTech.</p>
    <form action={submit} className="mt-8 grid gap-4">
      <input name="email" type="email" autoComplete="email" placeholder="E-mail" required/>
      <input name="password" type="password" autoComplete="current-password" placeholder="Senha" required/>
      {error && <p className="text-sm text-orange-400">{error}</p>}
      <button className="rounded-md bg-emerald-700 px-4 py-2 font-medium">Entrar</button>
    </form>
    <button onClick={() => signIn("email")} className="mt-4 text-sm text-zinc-300 underline">Entrar com link enviado por e-mail (responsáveis)</button>
    <p className="mt-6 text-sm text-zinc-400">Não tem conta? <Link className="text-emerald-400" href="/auth/register">Cadastre-se</Link></p>
  </main>;
}