import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AddBookForm } from "./add-book-form";

export const metadata: Metadata = { title: "Add Book" };

export default function AddBookPage() {
  return (
    <>
      <PageHeader
        title="Add a Book"
        text="Put a book from your shelf into the library."
      />
      <AddBookForm />
    </>
  );
}
