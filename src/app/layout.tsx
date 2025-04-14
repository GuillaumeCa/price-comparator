import Link from "next/link";
import { AuthProvider } from "../components/AuthProvider";
import "../styles/globals.css";
import { LoginButton } from "./LoginButton";
import { auth } from "./auth";

export const metadata = {
  title: "Price Comparator",
};

export default async function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="fr">
      <body>
        <AuthProvider session={session}>
          <div className="p-7 text-gray-300 max-w-4xl m-auto">
            <header className="flex justify-between">
              <Link href="/">
                <h1 className="mb-6 font-bold text-4xl">💰 Price Comparator</h1>
              </Link>
              <div>
                <LoginButton />
              </div>
            </header>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
