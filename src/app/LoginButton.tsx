"use client";

import { useUser } from "../api/auth";
import { Button } from "../components/Button";

import { signIn, signOut } from "next-auth/react";

export function LoginButton() {
  const { user } = useUser();

  return (
    <div className="flex gap-2 items-center">
      {user && <Button onClick={() => signOut()}>Logout</Button>}
      {!user && <Button onClick={() => signIn("discord")}>Login</Button>}
      {user?.image && (
        <img
          className="size-7 rounded-full"
          src={user.image}
          alt="Your profile image"
        />
      )}
    </div>
  );
}
