"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc/client";

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();
  const { data: book, isLoading, error } = trpc.books.byId.useQuery(id);
  const borrow = trpc.borrows.create.useMutation({
    onSuccess: () => {
      toast.success("Book borrowed! Return it within 7 days.");
      utils.books.invalidate();
      utils.borrows.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <Loader />;
  if (error?.data?.code === "NOT_FOUND" || error?.data?.code === "BAD_REQUEST")
    notFound();
  if (!book)
    return (
      <p className="py-20 text-center text-muted-foreground">
        {error?.message}
      </p>
    );

  const available = book.copies > 0;

  return (
    <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[2fr_3fr]">
      {/* biome-ignore lint/performance/noImgElement: images come from any imgbb host */}
      <img
        src={book.image}
        alt={book.title}
        className="aspect-[3/4] w-full rounded-lg border object-cover shadow-sm"
      />
      <div className="space-y-5">
        <Badge variant="secondary">{book.category}</Badge>
        <h1 className="font-heading text-4xl font-semibold md:text-5xl">
          {book.title}
        </h1>
        <p className="text-lg text-muted-foreground">by {book.author}</p>
        <p className="leading-relaxed">{book.description}</p>
        <dl className="grid gap-3 rounded-lg border bg-card p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Added by</dt>
            <dd className="font-medium">{book.addedBy.name}</dd>
            <dd className="text-muted-foreground">{book.addedBy.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Copies left</dt>
            <dd className="font-medium">{book.copies}</dd>
          </div>
        </dl>

        {available ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Borrow This Book</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Borrow "{book.title}"</DialogTitle>
                <DialogDescription>
                  You can keep this book for 7 days.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bName">User Name</Label>
                  <Input
                    id="bName"
                    value={session?.user.name ?? ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bEmail">User Email</Label>
                  <Input
                    id="bEmail"
                    value={session?.user.email ?? ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => borrow.mutate(book._id)}
                  disabled={borrow.isPending}
                >
                  {borrow.isPending ? "Borrowing..." : "Confirm Borrow"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button size="lg" disabled>
            Not Available
          </Button>
        )}
        <Button variant="link" asChild>
          <Link href="/books">Back to all books</Link>
        </Button>
      </div>
    </section>
  );
}
