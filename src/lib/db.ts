import { MongoClient } from "mongodb";

// Reuse one client across hot reloads and serverless invocations.
const g = globalThis as unknown as { mongo?: MongoClient };
g.mongo ??= new MongoClient(process.env.MONGODB_URI as string);
export const client = g.mongo;
export const db = client.db();

export type Book = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  copies: number;
  addedBy: { name: string; email: string };
  createdAt: Date;
};

export type Borrow = {
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: Date;
  returnDate: Date;
};

export const books = db.collection<Book>("books");
export const borrows = db.collection<Borrow>("borrows");

// Backs the "no double borrow" rule at the database level.
borrows
  .createIndex({ bookId: 1, userEmail: 1 }, { unique: true })
  .catch(() => {});
