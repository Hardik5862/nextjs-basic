import { connectDatabbase, validateEmail } from "../../helpers/db-utils";

async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    let client;

    try {
      client = await connectDatabbase();
    } catch (error) {
      return res.status(500).json({ message: "Database connection failed!" });
    }

    try {
      const db = client.db();
      await db.collection("newsletter").insertOne({ email });
    } catch (error) {
      client.close();
      return res.status(500).json({ message: "Data insertion failed!" });
    }

    client.close();

    return res.status(201).json({ message: "Signed up" });
  }

  return res.status(400).json({ message: "Invalid request" });
}

export default handler;
