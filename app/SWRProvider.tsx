"use client";

import { SWRConfig } from "swr";
import fetchJson from "@/lib/fetchJson";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}>
      {children}
    </SWRConfig>
  );
}
