import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MyBooksList } from "./my-books-list";

export const metadata: Metadata = { title: "My Books" };

export default function MyBooksPage() {
  return (
    <>
      <PageHeader title="My Books" text="Books you added to the library." />
      <MyBooksList />
    </>
  );
}
