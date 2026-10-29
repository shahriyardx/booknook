import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";

const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Fraunces({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "BookNook | Home", template: "BookNook | %s" },
  description:
    "A small online library. Add a book, borrow a book, return a book.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCProvider>
            {/* Navbar reads the URL, so it streams in after the static shell. */}
            <Suspense fallback={<div className="h-16 border-b" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
