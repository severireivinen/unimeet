import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  const genders = await db.collection("genders").find({}).toArray();
  return res.status(200).json(genders);
}
