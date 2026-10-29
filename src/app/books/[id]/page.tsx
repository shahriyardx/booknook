import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { BookDetails } from "./book-details";

export const metadata: Metadata = { title: "Book Details" };

export default function BookPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BookDetails />
    </Suspense>
  );
}
