import { cookies } from "next/headers";
import { getMovie } from "@/lib/getMovie";
import { getUserCookie } from "@/lib/getUserCookie";
import BackLinks from "./BackLinks";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUserCookie(cookies());
  if (!user) {
    redirect("/");
  }

  const { id } = params;
  const movie = await getMovie(id);

  if (!movie) return <h1>Not Found</h1>;

  return (
    <>
      <div style={{ margin: "0 1rem" }}>
        <h1 style={{ marginBottom: 0 }}>{movie.title}</h1>
        {movie.plot && (
          <p style={{ marginTop: 0, fontSize: 14, color: "#567" }}>
            {movie.plot}
          </p>
        )}
        <figure style={{ margin: 0, height: 300 }}>
          <img src={movie.poster} style={{ height: "100%" }} />
        </figure>

        <BackLinks />

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
            {JSON.stringify(movie, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
