import { firestore } from "../../../firebase/firebase";

export default async function handler(req, res) {
  const genders = [];
  await firestore
    .collection("genders")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        genders.push(doc.data());
      });
    });
  return res.status(200).json(genders);
}
