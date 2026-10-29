import {
  Atom,
  BookOpenCheck,
  Landmark,
  Search,
  Smile,
  Sparkles,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { Banner } from "./_home/banner";
import { NewArrivals } from "./_home/new-arrivals";

const steps = [
  {
    icon: Search,
    title: "Find a book",
    text: "Browse the shelf and open any book you like.",
  },
  {
    icon: BookOpenCheck,
    title: "Borrow it",
    text: "Confirm the borrow. The book is yours for 7 days.",
  },
  {
    icon: Undo2,
    title: "Return it",
    text: "Done reading? Return it from My Borrows in one click.",
  },
];

const categories = [
  { icon: Sparkles, name: "Fiction", text: "Novels and short stories" },
  { icon: Atom, name: "Science", text: "How the world works" },
  { icon: Landmark, name: "History", text: "Stories from the past" },
  { icon: Smile, name: "Kids", text: "Picture books and more" },
];

export default function Home() {
  return (
    <>
      <Banner />
      <NewArrivals />

      <section className="bg-secondary/60 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="section-title">How Borrowing Works</h2>
            <p className="mt-3 text-muted-foreground">
              Three steps. No library card needed.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-lg border bg-card p-8 text-center"
              >
                <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <s.icon className="size-6" />
                </span>
                <p className="text-sm font-semibold text-accent">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-heading text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 text-center">
          <h2 className="section-title">Top Categories</h2>
          <p className="mt-3 text-muted-foreground">
            Pick a shelf and start reading.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href="/books"
              className="flex h-full flex-col items-center rounded-lg border bg-card p-8 text-center transition hover:-translate-y-1 hover:border-primary"
            >
              <c.icon className="size-9 text-primary" />
              <h3 className="mt-4 font-heading text-xl font-semibold">
                {c.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
