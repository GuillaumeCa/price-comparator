import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";

type AuthState = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: any }) {
  const [loading, setLoading] = useState(true);
  const [currentSession, setSession] = useState<Session | null>(null);

  useEffect(() => {
    function getInitialSession() {
      const session = supabase.auth.session();

      if (session) {
        setSession(session);
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session: currentSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("missing auth provider");
  }

  return ctx;
}
