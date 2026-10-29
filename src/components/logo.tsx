import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <BookOpen className="size-5" />
      </span>
      <span className="font-heading text-2xl font-semibold tracking-tight">
        BookNook
      </span>
    </Link>
  );
}
