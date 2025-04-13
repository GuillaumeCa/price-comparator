import { useSession } from "next-auth/react";

export function useUser() {
  "use client";
  const { data: session, status } = useSession();
  return { user: session?.user, isLoading: status === "loading" };
}
