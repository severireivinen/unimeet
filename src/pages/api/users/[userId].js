import { firestore } from "../../../firebase/firebase";

export default async function handler(req, res) {
  const { userId } = req.query;

  const doc = await firestore.collection("users").doc(userId).get();

  if (!doc.exists) {
    return res.status(404);
  } else {
    return res.status(200).json(doc.data());
  }
}
