"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookForm } from "@/components/book-form";
import { trpc } from "@/lib/trpc/client";

export function AddBookForm() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.books.create.useMutation();

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12">
      <BookForm
        submitLabel="Add Book"
        onSubmit={async (values) => {
          await create.mutateAsync(values);
          toast.success("Book added to the library");
          utils.books.invalidate();
          router.push("/my-books");
        }}
      />
    </section>
  );
}
