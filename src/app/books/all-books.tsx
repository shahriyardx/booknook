"use client";

import { BookCard, BookGrid } from "@/components/book-card";
import { Loader } from "@/components/loader";
import { trpc } from "@/lib/trpc/client";

export function AllBooks() {
  const { data, isLoading } = trpc.books.list.useQuery();
  return (
    <section className="container mx-auto px-4 py-12">
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
          The shelf is empty right now.
        </p>
      )}
    </section>
  );
}
