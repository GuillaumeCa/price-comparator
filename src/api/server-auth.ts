import { auth } from "../app/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You are not authenticated");
  }

  return session.user;
}
