import Link from "next/link";
import { cookies } from "next/headers";
import { SessionUser } from "@/api/user";
import { unsealData } from "iron-session";
import clientPromise from "lib/mongodb";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";
import Session from "./Session";

// export const dynamic = "auto";
// export const dynamicParams = true;

async function getData(auth: boolean) {
  const strTime = new Date().getTime().toString();
  console.log(strTime);

  let limit = parseInt(strTime.slice(9, 11));
  let skip = parseInt(strTime.slice(11, 13));

  if (strTime.charAt(9) == "0" && strTime.charAt(11) == "0") {
    limit = 10;
    skip = 0;
  }

  if (limit % 2 == 0 && skip > 0) skip = limit * skip;

  console.log("Limit/skip:", limit, skip);

  if (!auth) limit = 1;

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

async function getUserCookie(
  cookies: ReadonlyRequestCookies
): Promise<SessionUser | null> {
  const cookieName = process.env.SESSION_COOKIE_NAME as string;
  const found = cookies.get(cookieName);

  if (!found) return null;

  const { user } = await unsealData(found.value, {
    password: process.env.SESSION_COOKIE_PASSWORD as string,
  });

  return user as unknown as SessionUser;
}

export default async function Home() {
  const _cookies = cookies();
  const user = await getUserCookie(_cookies);
  const logged = user != null;
  const { movies, limit, skip } = await getData(logged);

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
