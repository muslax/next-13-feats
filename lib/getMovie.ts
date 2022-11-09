import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export async function getMovie(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Not valid id");
    }

    const _id = new ObjectId(id);
    const client = await clientPromise;
    const collection = client.db("sample_mflix").collection("movies");
    const rs = await collection.findOne({ _id });

    if (!rs) return null;
    return JSON.parse(JSON.stringify(rs));
  } catch (error) {
    console.error(error);
    return null;
  }
}