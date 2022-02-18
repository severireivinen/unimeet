import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const client = await clientPromise;
  const db = client.db();
  const userId = session.user.id;

  const query = await db
    .collection("profiles")
    .find({ userId: ObjectId(userId) })
    .toArray();

  const user = query[0];

  const userLikes = user.likes;
  const userDislikes = user.dislikes;

  const userSwipes = userLikes.concat(userDislikes);

  const profiles = await db
    .collection("profiles")
    .find({
      $and: [
        { userId: { $nin: userSwipes } },
        { userId: { $ne: ObjectId(userId) } },
      ],
    })
    .toArray();

  console.log(profiles);

  res.status(200).json(profiles);
}
