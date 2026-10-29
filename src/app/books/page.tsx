import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AllBooks } from "./all-books";

export const metadata: Metadata = { title: "All Books" };

export default function BooksPage() {
  return (
    <>
      <PageHeader title="All Books" text="Every book on the BookNook shelf." />
      <AllBooks />
    </>
  );
}
