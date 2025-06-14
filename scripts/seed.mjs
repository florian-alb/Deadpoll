import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

if (!uri || !dbName) {
  console.error("Missing MONGODB_URI or MONGODB_DBNAME environment variables");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const usersCollection = db.collection("users");
    const pollsCollection = db.collection("polls");
    const answersCollection = db.collection("answers");

    await usersCollection.deleteMany({});
    await pollsCollection.deleteMany({});
    await answersCollection.deleteMany({});

    const userId = new ObjectId();
    const passwordHash = await bcrypt.hash("test", 10);

    const users = [
      {
        _id: userId,
        email: "test@test.com",
        name: "Test User",
        passwordHash,
        avatar: "",
        createdAt: new Date(),
      },
    ];

    await usersCollection.insertMany(users);

    const pollId = new ObjectId();
    const questions = [
      {
        _id: new ObjectId(),
        title: "What is your favorite color?",
        type: "QCM",
        possibleAnswers: ["Red", "Blue", "Green", "Yellow"],
      },
      {
        _id: new ObjectId(),
        title: "Any additional comments?",
        type: "Open",
        possibleAnswers: [],
      },
    ];

    const polls = [
      {
        _id: pollId,
        name: "Sample Poll",
        creator: userId,
        questions,
        created_at: new Date(),
      },
    ];

    await pollsCollection.insertMany(polls);

    const answers = [
      {
        pollId,
        userId,
        createdAt: new Date(),
        answers: [
          { questionId: questions[0]._id.toString(), answer: "Blue" },
          { questionId: questions[1]._id.toString(), answer: "No comments" },
        ],
      },
    ];

    await answersCollection.insertMany(answers);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await client.close();
  }
}

seed();
