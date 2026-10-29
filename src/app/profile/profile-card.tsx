"use client";

import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export function ProfileCard() {
  const { data, isPending } = authClient.useSession();
  if (isPending || !data) return <Loader />;
  const { user } = data;
  return (
    <section className="container mx-auto flex justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <Avatar className="mx-auto size-24 ring-4 ring-primary/20">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="section-title mt-5">{user.name}</h1>
        <p className="mt-1 text-muted-foreground">{user.email}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Member since{" "}
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        </p>
      </div>
    </section>
  );
}
