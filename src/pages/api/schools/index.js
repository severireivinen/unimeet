import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  const schools = await db.collection("schools").find({}).toArray();
  return res.status(200).json(schools);
}
