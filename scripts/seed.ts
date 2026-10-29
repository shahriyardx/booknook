// Adds a few starter books so the shelf is not empty. Run: bun scripts/seed.ts
import { MongoClient } from "mongodb";

const cover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
const addedBy = { name: "BookNook Team", email: "team@booknook.app" };

const seed = [
  [
    "The Hobbit",
    "J.R.R. Tolkien",
    "Fiction",
    "9780547928227",
    "Bilbo Baggins leaves his quiet home for a journey with thirteen dwarves and a wizard.",
  ],
  [
    "A Brief History of Time",
    "Stephen Hawking",
    "Science",
    "9780553380163",
    "From the Big Bang to black holes, a clear guide to how the universe works.",
  ],
  [
    "Sapiens",
    "Yuval Noah Harari",
    "History",
    "9780062316097",
    "How a small group of apes became the rulers of planet Earth.",
  ],
  [
    "Charlotte's Web",
    "E.B. White",
    "Kids",
    "9780064400558",
    "A pig named Wilbur and a clever spider named Charlotte become best friends.",
  ],
  [
    "Atomic Habits",
    "James Clear",
    "Others",
    "9780735211292",
    "Small changes, done every day, add up to big results.",
  ],
  [
    "The Selfish Gene",
    "Richard Dawkins",
    "Science",
    "9780198788607",
    "Why genes, not animals, are the real players in evolution.",
  ],
] as const;

const client = new MongoClient(process.env.MONGODB_URI as string);
const books = client.db().collection("books");
await books.insertMany(
  seed.map(([title, author, category, isbn, description], i) => ({
    title,
    author,
    category,
    image: cover(isbn),
    description,
    copies: 3,
    addedBy,
    createdAt: new Date(Date.now() - i * 60_000),
  })),
);
console.log(`Seeded ${seed.length} books`);
await client.close();
