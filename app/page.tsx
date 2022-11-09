import clientPromise from "lib/mongodb";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import Session from "./Session";

// export const dynamic = "auto";
// export const dynamicParams = true;

async function getData(isAuth: boolean) {
  const strTime = new Date().getTime().toString();
  console.log(strTime);

  let limit = parseInt(strTime.slice(9, 11));
  if (limit > 80) limit = 15;
  if (limit < 10) limit = 10;

  let skip = parseInt(strTime.slice(11, 13));
  // if (skip > 80) skip = 15;
  // if (skip < 10) skip = 10;

  if (strTime.charAt(9) == "0") {
    limit = 10;
    skip = 0;
  }
  console.log("Limit/skip:", limit, skip);

  if (!isAuth) limit = 1;

  const client = await clientPromise;
  const collection = client.db("sample_mflix").collection("movies");
  const rs = await collection
    .find(
      { poster: { $exists: true } },
      {
        limit,
        skip,
        projection: {
          title: 1,
          cast: 1,
          poster: 1,
        },
      }
    )
    .toArray();

  const data = {
    movies: rs,
    limit,
    skip,
  };
  return JSON.parse(JSON.stringify(data));
}

export default async function Home() {
  const headersList = headers();
  const nextCookie = cookies();
  const user = nextCookie.get(process.env.SESSION_COOKIE_NAME as string);
  const referer = headersList.get("referer");
  const isAuth = user && user.value.length > 100 ? true : false;
  const { movies, limit, skip } = await getData(isAuth);

  return (
    <>
      <div style={{ margin: "0 1rem" }}>
        <h1 style={{ marginBottom: 10 }}>Next 13 Movies</h1>

        <Session />

        <p style={{ marginTop: 0, fontSize: 14, color: "#567" }}>{referer}</p>

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
