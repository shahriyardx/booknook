"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BookForm } from "@/components/book-form";
import { Loader } from "@/components/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc/client";

export function MyBooksList() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.books.mine.useQuery();
  type Book = NonNullable<typeof data>[number];
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const update = trpc.books.update.useMutation();
  const remove = trpc.books.delete.useMutation({
    onSuccess: () => {
      toast.success("Book deleted");
      utils.books.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <Loader />;

  return (
    <section className="container mx-auto px-4 py-12">
      {!data?.length ? (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            You have not added any books yet.
          </p>
          <Button asChild>
            <Link href="/add-book">Add Book</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Copies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* biome-ignore lint/performance/noImgElement: images come from any imgbb host */}
                      <img
                        src={b.image}
                        alt={b.title}
                        className="h-16 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{b.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {b.author}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{b.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {b.copies}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(b)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleting(b)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit book</DialogTitle>
          </DialogHeader>
          {editing && (
            <BookForm
              initial={editing as Parameters<typeof BookForm>[0]["initial"]}
              submitLabel="Save Changes"
              onSubmit={async (values) => {
                await update.mutateAsync({ id: editing._id, ...values });
                toast.success("Book updated");
                utils.books.invalidate();
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleting?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the book from the library. You cannot undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleting && remove.mutate(deleting._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
