import clientPromise from "lib/mongodb";
import { headers } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";
// export const dynamicParams = true;

async function getData() {
  const strTime = new Date().getTime().toString();
  console.log(strTime);

  let limit = parseInt(strTime.slice(9, 11));
  if (limit > 80) limit = 15;
  if (limit < 10) limit = 10;

  let skip = parseInt(strTime.slice(11, 13));
  if (skip > 80) skip = 15;
  if (skip < 10) skip = 10;

  if (strTime.charAt(9) == "0") {
    limit = 10;
    skip = 0;
  }
  console.log("Limit/skip:", limit, skip);

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
  const { movies, limit, skip } = await getData();
  const referer = headersList.get("referer");

  return (
    <>
      <div style={{ margin: "0 1rem" }}>
        <h1>Next 13 with MongoDB</h1>

        <p style={{ marginTop: 0, fontSize: 14, color: "#567" }}>{referer}</p>

        <p style={{ fontWeight: 600 }}>
          Serving {movies.length} titles [{limit} - {skip}]
        </p>

        {movies.map((m: any) => (
          <p key={m._id} style={{ margin: "0.5rem 0" }}>
            <Link style={{ color: "blue" }} href={`/movie/${m._id}`}>
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
