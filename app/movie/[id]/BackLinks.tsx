"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackLinks() {
  const router = useRouter();

  return (
    <>
      <p style={{ margin: "0.5rem 0" }}>
        <Link style={{ color: "blue" }} href="/">
          Back (next/link)
        </Link>
        <span style={{ margin: "0 20px" }}>|</span>
        <a style={{ color: "blue" }} href="/">
          Back
        </a>
        <span style={{ margin: "0 20px" }}>|</span>
        <a
          style={{ color: "blue" }}
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}>
          Back (next/navigation)
        </a>
      </p>
    </>
  );
}
