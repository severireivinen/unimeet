import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import cloudinary from "cloudinary";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const { id } = req.query;

  // Configuration for cloudinary image upload
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Get the user from db
  const profileFromDb = await db
    .collection("profiles")
    .find({ userId: ObjectId(id) })
    .toArray();

  if (req.method === "GET") {
    if (profileFromDb.length === 1) {
      return res.status(200).json(profileFromDb[0]);
    } else {
      return res.status(404).json({ noProfile: true });
    }
  } else {
    const body = JSON.parse(req.body);
    // Get user profile picture
    const avatarBase64 = body.image;
    let avatarUrl;

    await cloudinary.v2.uploader.upload(
      `${avatarBase64}`,
      { folder: `users/${id}` },
      (error, result) => {
        if (error) {
          console.log("Error: ", error);
          return res.status(500).json({ error: "Problem with image upload" });
        } else {
          avatarUrl = result.secure_url;
        }
      }
    );

    // Get body for profile creation
    await db.collection("profiles").insertOne({
      userId: ObjectId(id),
      name: body.name,
      email: body.email,
      school: body.school,
      age: body.age,
      gender: body.gender,
      lookingForGender: body.lookingForGender,
      lookingForSchools: body.lookingForSchools,
      profileImg: avatarUrl,
      images: [avatarUrl],
      likes: [],
      dislikes: [],
    });
    return res.status(200).json({ ok: true });
  }
}
