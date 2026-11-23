import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import GuardianApproval from "@/models/GuardianApproval";
import { sendGuardianLink } from "@/lib/mailer";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(10).max(100),
  role: z.enum(["mentee", "mentor"]),
  age: z.coerce.number().int().min(13).max(120),
  guardianEmail: z.string().email().optional()
});

export async function POST(req: Request) {
  try {
    const input = schema.parse(await req.json());
    const isMinor = input.age < 18;
    if (isMinor && (input.role !== "mentee" || !input.guardianEmail)) {
      return NextResponse.json({ error: "Mentees menores precisam informar o e-mail do responsável." }, { status: 400 });
    }
    await connectDB();
    if (await User.exists({ email: input.email.toLowerCase() })) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: input.role,
      age: input.age,
      isMinor,
      guardianEmail: isMinor ? input.guardianEmail : undefined,
      isGuardianApproved: !isMinor
    });

    if (isMinor) {
      const token = randomBytes(32).toString("hex");
      await GuardianApproval.create({
        menteeId: user._id,
        guardianEmail: input.guardianEmail,
        token,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
      });
      const base = process.env.GUARDIAN_APPROVAL_BASE_URL ?? process.env.NEXTAUTH_URL;
      if (!base) throw new Error("Configure GUARDIAN_APPROVAL_BASE_URL.");
      await sendGuardianLink(input.guardianEmail!, `${base}/api/auth/approve-guardian?token=${token}`);
    }
    return NextResponse.json({ ok: true, waitingForGuardian: isMinor }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "Não foi possível concluir o cadastro." }, { status: 500 });
  }
}