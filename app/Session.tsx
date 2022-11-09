"use client";

import { SessionUser } from "@/api/user";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import { FormEvent, useContext, useState } from "react";
import SessionContext from "./SessionProvider";

export default function Session() {
  const { sessionUser, setSessionUser } = useContext(SessionContext);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const body = {
      username: event.currentTarget.username.value,
    };

    try {
      const user = await fetchJson("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setTimeout(() => {
        setSessionUser(user as SessionUser);
        setSubmitting(false);
        window.location.href = "/";
      }, 300);
    } catch (error) {
      setSubmitting(false);
      if (error instanceof FetchError) {
        setErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  };

  return (
    <div
      style={{
        borderTop: "1px solid #7b9",
        borderBottom: "1px solid #7b9",
        marginBottom: 10,
        backgroundColor: submitting ? "#f0fff9" : "",
        display: "flex",
        alignItems: "center",
        height: 70,
      }}>
      {!sessionUser && (
        <form onSubmit={handler}>
          <input
            type="text"
            name="username"
            autoComplete="off"
            defaultValue="muslax"
            disabled={submitting}
            required
          />
          <button style={{ marginLeft: 6 }} disabled={submitting} type="submit">
            Login
          </button>
          <p style={{ margin: "4px 0 0" }}>{errorMsg ? errorMsg : "Ready"}</p>
        </form>
      )}
      {sessionUser && (
        <p>
          <span>
            Logged in as <b>{sessionUser.username}</b>
          </span>
          <button
            style={{ marginLeft: 8 }}
            onClick={async (e) => {
              try {
                await fetchJson("/api/logout", { method: "POST" });
                setSessionUser(undefined);
                window.location.href = "/";
              } catch (error) {
                alert(error);
              }
            }}>
            Sign out
          </button>
        </p>
      )}
    </div>
  );
}
