"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthCard, GoogleButton } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  // Only allow same-origin paths. Parsing with URL also catches "/\evil.com" tricks.
  const target = safePath(redirect);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message ?? "Login failed");
    toast.success("Welcome back!");
    router.push(target);
  }

  return (
    <AuthCard title="Login">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => toast.info("Password reset is not available yet")}
        >
          Forget Password?
        </button>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <GoogleButton callbackURL={target} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthCard>
  );
}

function safePath(redirect: string | null) {
  // A fake base keeps this safe to run on the server too.
  const url = new URL(redirect ?? "/", "http://local");
  if (url.origin !== "http://local") return "/";
  // Dot segments like "/.//evil.com" normalize to "//evil.com", which a browser
  // reads as another host. Collapse leading slashes to one.
  return `/${url.pathname.replace(/^\/+/, "")}${url.search}`;
}
