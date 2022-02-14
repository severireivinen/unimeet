import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    // Get users
    console.log("Session", JSON.stringify(session, null, 2));
  } else {
    res.status(401);
  }
  res.end();
}
