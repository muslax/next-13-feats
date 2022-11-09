'use client'

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import { SessionUser } from "@/api/user";
import fetchJson from "./fetchJson";

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const router = useRouter()
  const { data: user, mutate: mutateUser, isValidating, error } = useSWR<SessionUser>("/api/user", fetchJson);
  console.log(user, redirectTo);


  // This effect doesn't work with appDir
  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (redirectTo && user == undefined) {
      // router.push(redirectTo);
      // console.log("SHOULD REDIRECT");

      if (window) window.location.href = '/login'
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      router.push(redirectTo);
    }
  }, [router, user, redirectIfFound, redirectTo]);

  return { user, mutateUser, isValidating };
}
