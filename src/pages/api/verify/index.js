import { getSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export default async function handler(req, res) {
  const session = req.body;

  if (session) {
    // Get users
    const uid = session.user.email;
    console.log(uid);
    console.log("starting");

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("found");
      return res.status(200).json({ ok: true });
    } else {
      console.log("not found 1");
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    console.log("not found 2");
    return res.status(401).json({ error: "Not authorized" });
  }
}
