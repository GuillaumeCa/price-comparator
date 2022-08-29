import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";

const AuthContext = createContext<{ session: Session | null } | null>(null);

export function AuthProvider({ children }: { children: any }) {
  const [currentSession, setSession] = useState<Session | null>(null);

  useEffect(() => {
    function getInitialSession() {
      const session = supabase.auth.session();

      if (session) {
        setSession(session);
      }
    }

    getInitialSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session: currentSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession(): Session | null {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("missing auth provider");
  }

  return ctx.session;
}
