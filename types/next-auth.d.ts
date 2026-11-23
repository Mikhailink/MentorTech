import "next-auth";
declare module "next-auth" {
  interface User {
    role?: string;
    isMinor?: boolean;
    isGuardianApproved?: boolean;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      isMinor: boolean;
      isGuardianApproved: boolean;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    isMinor?: boolean;
    isGuardianApproved?: boolean;
  }
}