import { getSession } from "next-auth/client";
import { firestore } from "../../../firebase/firebase";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const users = [];
  const likedUserIds = [];
  const dislikedUserIds = [];

  if (!session) {
    return res.status(400).end();
  }

  // Get likes
  await firestore
    .collection("users")
    .doc(session.user.id)
    .collection("likes")
    .get()
    .then((snapshot) => snapshot.forEach((doc) => likedUserIds.push(doc.id)));

  // Get dislikes
  await firestore
    .collection("users")
    .doc(session.user.id)
    .collection("dislikes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => dislikedUserIds.push(doc.id))
    );

  // Get users
  await firestore
    .collection("users")
    .where("id", "!=", session.user.id)
    .get()
    .then((snapshot) => snapshot.forEach((doc) => users.push(doc.data())));

  //console.log("Users: ", users);
  //console.log("User likes:  ", likedUsers);

  const toreturn = users.filter(
    (item) =>
      !likedUserIds.includes(item.id) && !dislikedUserIds.includes(item.id)
  );

  res.status(200).json(toreturn);
}
