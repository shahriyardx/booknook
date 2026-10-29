import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BorrowsTable } from "./borrows-table";

export const metadata: Metadata = { title: "My Borrows" };

export default function MyBorrowsPage() {
  return (
    <>
      <PageHeader title="My Borrows" text="Books you are reading right now." />
      <BorrowsTable />
    </>
  );
}
