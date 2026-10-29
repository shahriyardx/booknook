"use client";

import Link from "next/link";
import { BookCard, BookGrid } from "@/components/book-card";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

export function NewArrivals() {
  const { data, isLoading } = trpc.books.list.useQuery({ limit: 10 });

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="section-title">New Arrivals</h2>
        <p className="mt-3 text-muted-foreground">
          The latest books added by our readers.
        </p>
      </div>
      {isLoading ? (
        <Loader />
      ) : data?.length ? (
        <BookGrid>
          {data.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </BookGrid>
      ) : (
        <p className="text-center text-muted-foreground">
          No books yet. Be the first to add one.
        </p>
      )}
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/books">See All Books</Link>
        </Button>
      </div>
    </section>
  );
}
