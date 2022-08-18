import { MongoClient } from "mongodb";
async function connectToDB() {
  const client = await MongoClient.connect(
    "mongodb+srv://Abdelnaby:HJeRrLjYJeMGixWt@cluster0.idf4k.mongodb.net/events?retryWrites=true&w=majority"
  );
  return client;
}
async function insertToDB(client, document) {
  const db = client.db();
  await db.collection("email").insertOne(document);
}
async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email Address." });
      return;
    }
    let client;
    try {
      client = await connectToDB();
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database failed!" });
      return;
    }
    try {
      await insertToDB(client, { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting data failed!" });
      return;
    }

    res.status(201).json({ message: "Signed up!" });
  }
}
export default handler;
