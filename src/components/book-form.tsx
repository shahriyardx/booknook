"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient, uploadImage } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/utils";

export type BookValues = {
  title: string;
  author: string;
  category: (typeof CATEGORIES)[number];
  image: string;
  description: string;
  copies: number;
};

type Props = {
  initial?: BookValues;
  submitLabel: string;
  onSubmit: (values: BookValues) => Promise<unknown>;
};

export function BookForm({ initial, submitLabel, onSubmit }: Props) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const file = form.get("image") as File;
    setLoading(true);
    try {
      // On edit, keep the old image unless a new file is picked.
      const image = file?.size ? await uploadImage(file) : initial?.image;
      if (!image) throw new Error("Please choose a book image");
      await onSubmit({
        title: String(form.get("title")),
        author: String(form.get("author")),
        category: String(form.get("category")) as BookValues["category"],
        image,
        description: String(form.get("description")),
        copies: Number(form.get("copies")),
      });
      if (!initial) formEl.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="title">Book Title</Label>
        <Input id="title" name="title" defaultValue={initial?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author Name</Label>
        <Input
          id="author"
          name="author"
          defaultValue={initial?.author}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          defaultValue={initial?.category ?? "Fiction"}
          required
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="copies">Total Copies</Label>
        <Input
          id="copies"
          name="copies"
          type="number"
          min={0}
          defaultValue={initial?.copies ?? 1}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="image">
          Book Image {initial && "(leave empty to keep the current one)"}
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required={!initial}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userName">User Name</Label>
        <Input
          id="userName"
          value={session?.user.name ?? ""}
          readOnly
          className="bg-muted"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userEmail">User Email</Label>
        <Input
          id="userEmail"
          value={session?.user.email ?? ""}
          readOnly
          className="bg-muted"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="sm:col-span-2"
        disabled={loading}
      >
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
