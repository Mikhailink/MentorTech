import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import Mentorship from "../models/Mentorship";

async function seed() {
  await connectDB();
  const passwordHash = await bcrypt.hash("MentorTechDemo!2026", 12);
  const mentor = await User.findOneAndUpdate(
    { email: "mentor@example.com" },
    { $set: { name: "Mentor Demo", email: "mentor@example.com", role: "mentor", passwordHash, isGuardianApproved: true } },
    { upsert: true, new: true }
  );
  const mentee = await User.findOneAndUpdate(
    { email: "aluno@example.com" },
    { $set: { name: "Aluno Demo", email: "aluno@example.com", role: "mentee", age: 20, isMinor: false, isGuardianApproved: true } },
    { upsert: true, new: true }
  );
  await Mentorship.updateOne(
    { mentorId: mentor._id, menteeId: mentee._id },
    { $set: { mentorId: mentor._id, menteeId: mentee._id, status: "active", weeklyHours: 2, startDate: new Date() } },
    { upsert: true }
  );
  console.info("Seed concluído. Login do mentor: mentor@example.com / MentorTechDemo!2026");
  process.exit(0);
}

seed().catch(error => { console.error(error); process.exit(1); });