import { Resend } from "resend";

export async function sendGuardianLink(email: string, url: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY ausente.");
    console.info(`[MentorTech] Link de aprovação para ${email}: ${url}`);
    return;
  }
  const resend = new Resend(key);
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "MentorTech <onboarding@resend.dev>",
    to: email,
    subject: "Aprovação de conta no MentorTech",
    html: `<p>Um jovem solicitou acesso ao MentorTech.</p><p><a href="${url}">Revisar e aprovar</a></p>`
  });
  if (result.error) throw new Error("Falha ao enviar e-mail de aprovação.");
}