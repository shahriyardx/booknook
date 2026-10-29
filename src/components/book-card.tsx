import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  book: {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
  };
};

export function BookCard({ book }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        {/* biome-ignore lint/performance/noImgElement: images come from any imgbb host */}
        <img
          src={book.image}
          alt={book.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="secondary" className="w-fit">
          {book.category}
        </Badge>
        <h3 className="line-clamp-1 font-heading text-lg font-semibold">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <Button asChild className="mt-auto w-full">
          <Link href={`/books/${book._id}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
}

export function BookGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">{children}</div>
  );
}
