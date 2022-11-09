import Link from "next/link";
import Session from "./Session";
import { cookies } from "next/headers";
import { getMovies } from "@/lib/getMovies";
import { getUserCookie } from "@/lib/getUserCookie";

// export const dynamic = "auto";
// export const dynamicParams = true;

export default async function Home() {
  const user = await getUserCookie(cookies());
  const logged = user != null;
  const { movies, limit, skip } = await getMovies(logged);

  return (
    <>
      <div style={{ margin: "0 1rem" }}>
        <h1 style={{ marginBottom: 10 }}>Next 13 Movies</h1>

        <Session user={user} />

        <pre>{JSON.stringify(user, null, 2)}</pre>

        <p style={{ fontWeight: 600 }}>
          Serving {movies.length} titles [{limit} - {skip}]
        </p>

        {movies.map((m: any) => (
          <p key={m._id} style={{ margin: "0.5rem 0" }}>
            <Link style={{}} href={`/movie/${m._id}`}>
              {m.title}
            </Link>
          </p>
        ))}

        <div
          style={{
            width: "100%",
            maxHeight: 300,
            margin: "1rem 0",
            overflowX: "scroll",
            overflowY: "scroll",
            border: "1px solid #eebb11",
          }}>
          <pre style={{ fontSize: 12, margin: 0 }}>
            {JSON.stringify(movies, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
