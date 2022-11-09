"use client";

import { createContext, Dispatch, ReactNode, useEffect, useState } from "react";
import { SessionUser } from "@/api/user";
import useUser from "@/lib/useUser";

interface SessionContextProps {
  sessionUser: SessionUser | undefined;
  setSessionUser: Dispatch<SessionUser | undefined>;
}

const SessionContext = createContext<SessionContextProps>({
  sessionUser: undefined,
  setSessionUser: () => undefined,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [sessionUser, setSessionUser] = useState<SessionUser | undefined>(
    undefined
  );

  useEffect(() => {
    if (user) setSessionUser(user);
    return () => {};
  }, [user, setSessionUser]);

  return (
    <SessionContext.Provider value={{ sessionUser, setSessionUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionContext;
