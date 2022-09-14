import Head from "next/head";
import Link from "next/link";
import { supabase } from "../api/supabase";
import { useSession } from "../components/AuthProvider";
import { Button, LinkButton } from "../components/Button";

export function BaseLayout({
  children,
  showLogin = false,
}: {
  children: React.ReactNode;
  showLogin?: boolean;
}) {
  const { session, loading } = useSession();

  return (
    <div className="p-7 text-gray-300 max-w-4xl m-auto">
      <Head>
        <title>Price Comparator</title>
      </Head>

      <header className="flex justify-between">
        <Link href="/">
          <a>
            <h1 className="mb-6 font-bold text-4xl">Price Comparator</h1>
          </a>
        </Link>
        {showLogin && (
          <div>
            {!session && !loading && (
              <LinkButton href="/login">Login</LinkButton>
            )}
            {session && !loading && (
              <Button type="button" onClick={() => supabase.auth.signOut()}>
                Logout
              </Button>
            )}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
