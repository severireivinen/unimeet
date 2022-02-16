import { firestore } from "../../../firebase/firebase";

export default async function handler(req, res) {
  const schools = [];
  await firestore
    .collection("schools")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        schools.push(doc.data());
      });
    });
  console.log("API: schools: ", schools);
  return res.status(200).json(schools);
}
