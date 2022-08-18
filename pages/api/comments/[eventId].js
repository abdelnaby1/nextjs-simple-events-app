import { MongoClient } from "mongodb";
async function handler(req, res) {
  const eventId = req.query.eventId;
  const client = await MongoClient.connect(
    "mongodb+srv://Abdelnaby:HJeRrLjYJeMGixWt@cluster0.idf4k.mongodb.net/events?retryWrites=true&w=majority"
  );
  const db = client.db();
  if (req.method === "POST") {
    const { email, name, text } = req.body;
    if (
      !email.includes("@") ||
      !name ||
      !name.trim() === "" ||
      !text ||
      !text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid Inputs." });
      return;
    }
    const newComment = {
      email,
      name,
      text,
      eventId,
    };
    try {
      await db.collection("comments").insertOne(newComment);
      client.close();
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({ message: "Added Comment. " });
  }

  if (req.method === "GET") {
    const documents = await db
      .collection("comments")
      .find()
      .sort({ _id: -1 })
      .toArray();
    res.status(200).json({ comments: documents });
  }
}
export default handler;
