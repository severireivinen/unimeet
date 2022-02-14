import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Invalid request method" });
  } else {
    const auth = getAuth();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "No body " });
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // Signed in
        const user = userCredentials.user;
        setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          displayName: user.displayName,
          timestamp: serverTimestamp(),
        });

        return res.send(200);
      })
      .catch((error) => {
        const errorCode = error.code;

        console.log(errorCode);

        switch (errorCode) {
          case "auth/weak-password":
            res
              .status(400)
              .json({ error: "Salasanan täytyy olla vähintään 6 merkkiä" });
            break;

          case "auth/email-already-in-use":
            res.status(400).json({ error: "Sähköposti on jo käytössä" });
            break;
          default:
            res.status(404).json({ error: "Tuntematon virhe" });
            break;
        }
      });
  }
}
