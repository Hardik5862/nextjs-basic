import { connectDatabbase, validateEmail } from "../../../helpers/db-utils";

async function handler(req, res) {
  const { eventId } = req.query;

  let client;

  try {
    client = await connectDatabbase();
  } catch (error) {
    return res.status(500).json({ message: "Database connection failed!" });
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !validateEmail(email) ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      client.close();
      return res.status(400).json({ message: "Invalid entered data!" });
    }

    const newComment = { email, name, text, eventId };

    let result;
    try {
      const db = client.db();
      result = await db.collection("comments").insertOne(newComment);
    } catch (error) {
      client.close();
      return res.status(500).json({ message: "Data insertion failed!" });
    }

    newComment._id = result.insertedId;

    client.close();

    return res
      .status(201)
      .json({ message: "Comment created", addedComment: newComment });
  }

  if (req.method === "GET") {
    const db = client.db();
    const result = await db
      .collection("comments")
      .find({ eventId })
      .sort({ _id: -1 })
      .toArray();

    client.close();

    return res.status(200).json({ comments: result });
  }

  client.close();

  return res.status(400).json({ message: "Invalid request" });
}

export default handler;
