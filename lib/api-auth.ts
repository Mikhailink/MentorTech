import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function currentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  await connectDB();
  // Estado consultado do banco em cada request; não confiar em flags antigas do JWT.
  return User.findById(session.user.id);
}

export async function protectedUser() {
  const user = await currentUser();
  if (!user) return { error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  if (user.role === "mentee" && user.isMinor && !user.isGuardianApproved) {
    return { error: NextResponse.json({ error: "Aguardando aprovação do responsável." }, { status: 403 }) };
  }
  return { user };
}