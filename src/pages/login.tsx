import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { BaseLayout } from "../layout/BaseLayout";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [previousEmail, setPreviousEmail] = useState<string | null>(null);

  useEffect(() => {
    setPreviousEmail(localStorage.getItem("previousEmail"));
  }, []);

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn(
        { email },
        {
          redirectTo: window.location.origin,
        }
      );
      if (error) throw error;
      alert("Check your email for the login link!");

      localStorage.setItem("previousEmail", email);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="flex align-middle justify-center">
        <div className="p-4 bg-gray-600 rounded-md">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="mt-3">Sign in via magic link with your email below</p>
          <div>
            <form>
              <input
                className="my-3 w-full px-2 py-1 rounded text-gray-700"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </form>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              className="bg-gray-400 w-full rounded px-2 py-1 font-semibold text-gray-700"
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Send magic link"}</span>
            </button>
            {previousEmail && !loading && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin(previousEmail);
                }}
                className="mt-2 bg-gray-400 w-full rounded px-2 py-1 font-semibold text-gray-700"
              >
                Send to {previousEmail}
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
