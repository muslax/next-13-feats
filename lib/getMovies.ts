import clientPromise from "./mongodb";

export async function getMovies(auth: boolean) {
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