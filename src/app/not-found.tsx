import { BookX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
      <BookX className="size-16 text-primary" />
      <p className="mt-6 font-heading text-7xl font-semibold text-accent">
        404
      </p>
      <h1 className="section-title mt-2">This page is not on our shelf</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for was moved, removed, or never existed.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </section>
  );
}
