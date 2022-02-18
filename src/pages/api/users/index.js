import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  const users = await db.collection("users").find({}).toArray();

  console.log(users);

  res.json(users);
  //res.status(200).end();
}
