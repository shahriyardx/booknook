// Seeds 50 books for the owner account. Runs on every container start, but
// does nothing once the owner has any books. Manual run: node scripts/seed.mjs
import { MongoClient } from "mongodb";

const OWNER_EMAIL = "mdshahriyaralam9@gmail.com";

// [title, author, category, Open Library cover id, description]
const seed = [
  [
    "The Hobbit",
    "J.R.R. Tolkien",
    "Fiction",
    14627509,
    "Bilbo Baggins leaves his quiet hole for a quest with thirteen dwarves and a dragon at the end.",
  ],
  [
    "Pride and Prejudice",
    "Jane Austen",
    "Fiction",
    14348537,
    "Elizabeth Bennet and Mr. Darcy clash over pride, class, and first impressions.",
  ],
  [
    "Nineteen Eighty-Four",
    "George Orwell",
    "Fiction",
    9267242,
    "Winston Smith lives under a state that watches every move and rewrites the past.",
  ],
  [
    "To Kill a Mockingbird",
    "Harper Lee",
    "Fiction",
    14351077,
    "A young girl watches her father defend a Black man in a small Southern town.",
  ],
  [
    "The Great Gatsby",
    "F. Scott Fitzgerald",
    "Fiction",
    10590366,
    "A mysterious millionaire throws grand parties to win back a lost love.",
  ],
  [
    "Dune",
    "Frank Herbert",
    "Fiction",
    11481354,
    "A noble family takes control of a desert planet that holds the most valuable spice in the universe.",
  ],
  [
    "Project Hail Mary",
    "Andy Weir",
    "Fiction",
    11200092,
    "A lone astronaut wakes up with no memory and one job: save Earth.",
  ],
  [
    "The Martian",
    "Andy Weir",
    "Fiction",
    11447888,
    "Stranded on Mars, an astronaut uses science and humor to stay alive.",
  ],
  [
    "The Hitchhiker's Guide to the Galaxy",
    "Douglas Adams",
    "Fiction",
    12986869,
    "Seconds before Earth is destroyed, Arthur Dent hitches a ride into a very strange galaxy.",
  ],
  [
    "The Name of the Wind",
    "Patrick Rothfuss",
    "Fiction",
    11480483,
    "Kvothe tells the true story of how he became a legend.",
  ],
  [
    "A Brief History of Time",
    "Stephen Hawking",
    "Science",
    10432365,
    "From the Big Bang to black holes, a clear guide to how the universe works.",
  ],
  [
    "Cosmos",
    "Carl Sagan",
    "Science",
    8283901,
    "A tour of the universe and our place in it.",
  ],
  [
    "The Selfish Gene",
    "Richard Dawkins",
    "Science",
    133936,
    "Why genes, not animals, are the real players in evolution.",
  ],
  [
    "The Gene",
    "Siddhartha Mukherjee",
    "Science",
    11320163,
    "The story of the gene, from Mendel's peas to editing DNA.",
  ],
  [
    "The Immortal Life of Henrietta Lacks",
    "Rebecca Skloot",
    "Science",
    8364866,
    "How one woman's cells changed medicine without her knowing.",
  ],
  [
    "Silent Spring",
    "Rachel Carson",
    "Science",
    3825693,
    "The book that showed how pesticides harm nature and started a movement.",
  ],
  [
    "The Origin of Species",
    "Charles Darwin",
    "Science",
    7153600,
    "Darwin's case for evolution by natural selection.",
  ],
  [
    "Astrophysics for People in a Hurry",
    "Neil deGrasse Tyson",
    "Science",
    7984709,
    "The big ideas of the universe in short, easy chapters.",
  ],
  [
    "The Body",
    "Bill Bryson",
    "Science",
    12722746,
    "A friendly tour of the human body and how it keeps us alive.",
  ],
  [
    "Thinking, Fast and Slow",
    "Daniel Kahneman",
    "Science",
    13290711,
    "The two systems that drive how we think and decide.",
  ],
  [
    "Sapiens",
    "Yuval Noah Harari",
    "History",
    8634250,
    "How a small group of apes became the rulers of planet Earth.",
  ],
  [
    "Guns, Germs, and Steel",
    "Jared Diamond",
    "History",
    7884018,
    "Why some societies grew powerful while others did not.",
  ],
  [
    "The Diary of a Young Girl",
    "Anne Frank",
    "History",
    13526331,
    "A Jewish girl's diary written while hiding from the Nazis.",
  ],
  [
    "Team of Rivals",
    "Doris Kearns Goodwin",
    "History",
    9286949,
    "How Abraham Lincoln turned his political rivals into his cabinet.",
  ],
  [
    "The Guns of August",
    "Barbara W. Tuchman",
    "History",
    6616967,
    "The first month of World War I, day by day.",
  ],
  [
    "SPQR",
    "Mary Beard",
    "History",
    7418788,
    "A fresh history of ancient Rome, from myth to empire.",
  ],
  [
    "The Silk Roads",
    "Peter Frankopan",
    "History",
    8963642,
    "World history told from the trade routes that linked East and West.",
  ],
  [
    "Band of Brothers",
    "Stephen E. Ambrose",
    "History",
    3101053,
    "One company of American paratroopers from D-Day to the end of the war.",
  ],
  [
    "1776",
    "David McCullough",
    "History",
    541237,
    "The year the American Revolution was almost lost.",
  ],
  [
    "The Wright Brothers",
    "David McCullough",
    "History",
    7317364,
    "Two bicycle makers from Ohio who taught the world to fly.",
  ],
  [
    "Charlotte's Web",
    "E.B. White",
    "Kids",
    4792394,
    "A pig named Wilbur and a clever spider named Charlotte become best friends.",
  ],
  [
    "Matilda",
    "Roald Dahl",
    "Kids",
    12889769,
    "A brilliant girl with terrible parents discovers she has special powers.",
  ],
  [
    "Charlie and the Chocolate Factory",
    "Roald Dahl",
    "Kids",
    12459564,
    "Five children win a tour of Willy Wonka's magical factory.",
  ],
  [
    "Harry Potter and the Philosopher's Stone",
    "J. K. Rowling",
    "Kids",
    15155833,
    "An orphan learns he is a wizard and goes to Hogwarts.",
  ],
  [
    "The Lion, the Witch and the Wardrobe",
    "C.S. Lewis",
    "Kids",
    8441376,
    "Four children step through a wardrobe into the land of Narnia.",
  ],
  [
    "Where the Wild Things Are",
    "Maurice Sendak",
    "Kids",
    50842,
    "Max sails away to an island full of wild things.",
  ],
  [
    "The Very Hungry Caterpillar",
    "Eric Carle",
    "Kids",
    7835968,
    "A tiny caterpillar eats its way through the week.",
  ],
  [
    "Diary of a Wimpy Kid",
    "Jeff Kinney",
    "Kids",
    14376136,
    "Greg Heffley survives middle school, one bad idea at a time.",
  ],
  [
    "Wonder",
    "R. J. Palacio",
    "Kids",
    8223160,
    "Auggie, born with a different face, starts school for the first time.",
  ],
  [
    "The Lightning Thief",
    "Rick Riordan",
    "Kids",
    7239831,
    "Percy Jackson finds out his father is a Greek god.",
  ],
  [
    "Atomic Habits",
    "James Clear",
    "Others",
    12539702,
    "Small changes, done every day, add up to big results.",
  ],
  [
    "How to Win Friends and Influence People",
    "Dale Carnegie",
    "Others",
    13314878,
    "Classic advice on getting along with people.",
  ],
  [
    "The Psychology of Money",
    "Morgan Housel",
    "Others",
    10389354,
    "Why how you behave with money matters more than what you know.",
  ],
  [
    "Deep Work",
    "Cal Newport",
    "Others",
    7988607,
    "How to focus without distraction in a noisy world.",
  ],
  [
    "The 7 Habits of Highly Effective People",
    "Stephen R. Covey",
    "Others",
    10079937,
    "Seven habits for a better personal and work life.",
  ],
  [
    "Man's Search for Meaning",
    "Viktor E. Frankl",
    "Others",
    11203708,
    "A survivor of the death camps on finding purpose in suffering.",
  ],
  [
    "The Alchemist",
    "Paulo Coelho",
    "Others",
    11556106,
    "A shepherd boy follows his dream across the desert.",
  ],
  [
    "Rich Dad Poor Dad",
    "Robert T. Kiyosaki",
    "Others",
    8315603,
    "What the rich teach their kids about money that others do not.",
  ],
  [
    "The Power of Habit",
    "Charles Duhigg",
    "Others",
    9078085,
    "Why we do what we do, and how to change it.",
  ],
  [
    "Educated",
    "Tara Westover",
    "Others",
    8314077,
    "A girl raised off the grid teaches herself enough to get a PhD.",
  ],
];

const client = new MongoClient(process.env.MONGODB_URI);
try {
  const db = client.db();
  const books = db.collection("books");
  if (await books.findOne({ "addedBy.email": OWNER_EMAIL })) {
    console.log("Seed skipped: owner already has books");
  } else {
    const user = await db.collection("user").findOne({ email: OWNER_EMAIL });
    const addedBy = {
      name: user?.name ?? "Md Shahriyar Alam",
      email: OWNER_EMAIL,
    };
    await books.insertMany(
      seed.map(([title, author, category, coverId, description], i) => ({
        title,
        author,
        category,
        image: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
        description,
        copies: 3,
        addedBy,
        createdAt: new Date(Date.now() - i * 60_000),
      })),
    );
    console.log(`Seeded ${seed.length} books for ${OWNER_EMAIL}`);
  }
} finally {
  await client.close();
}
