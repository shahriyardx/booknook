"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc/client";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" });

export function BorrowsTable() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.borrows.list.useQuery();
  const giveBack = trpc.borrows.return.useMutation({
    onSuccess: () => {
      toast.success("Book returned. Thank you!");
      utils.borrows.invalidate();
      utils.books.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <Loader />;

  return (
    <section className="container mx-auto px-4 py-12">
      {!data?.length ? (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">You have no borrowed books.</p>
          <Button asChild>
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Borrow Date
                </TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    {/* biome-ignore lint/performance/noImgElement: images come from any imgbb host */}
                    <img
                      src={b.bookImage}
                      alt={b.bookTitle}
                      className="h-16 w-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{b.bookTitle}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {fmt(b.borrowDate)}
                  </TableCell>
                  <TableCell>{fmt(b.returnDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={giveBack.isPending}
                      onClick={() => giveBack.mutate(b._id)}
                    >
                      Return Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
