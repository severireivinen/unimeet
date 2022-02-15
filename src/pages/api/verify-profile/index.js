import { firestore, storage } from "../../../firebase/firebase";
import firebase from "firebase";
import { getSession } from "next-auth/client";

/** TODO: Add checks for fields */

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const session = await getSession({ req });
  const userId = session.user.id;
  console.log(userId);
  const userRef = await firestore.collection("users").doc(userId).get();

  if (!body) {
    return res.status(400).end();
  }

  // User not found?
  if (!userRef) {
    return res.status(404).end();
  } else {
    firestore
      .collection("users")
      .doc(userId)
      .set({
        name: body.name,
        email: body.email,
        emailVerified: null,
        school: body.school,
        age: body.age,
        isFinished: true,
        gender: body.gender,
        lookingForGender: body.lookingForGender,
        lookingForSchools: body.lookingForSchools,
        registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        const timeForImage = Date.now();
        const uploadTask = storage
          .ref(`users/${userId}/${timeForImage}`)
          .putString(body.image, "data_url");

        uploadTask.on(
          "state_change",
          null,
          (error) => console.error(error),
          () => {
            // After upload completes
            storage
              .ref(`users/${userId}/${timeForImage}`)
              .getDownloadURL()
              .then((url) => {
                firestore.collection("users").doc(userId).set(
                  {
                    profileImg: url,
                  },
                  { merge: true }
                );
              });
          }
        );
      });
    return res.status(200).end();
  }
}
