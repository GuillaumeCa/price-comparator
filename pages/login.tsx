import { useState } from "react";
import { supabase } from "../api/supabase";
import { BaseLayout } from "../layout/BaseLayout";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="flex">
        <div className="">
          <h2 className="text-3xl">Login</h2>
          <p className="">Sign in via magic link with your email below</p>
          <div>
            <input
              className=""
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              className=""
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Send magic link"}</span>
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
