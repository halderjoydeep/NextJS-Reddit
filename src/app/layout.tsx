import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Breadit",
  description: "A reddit clone built with NextJS 13",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-slate-50 pt-12 text-slate-900 antialiased",
          inter.className,
        )}
      >
        <Navbar />
        <main className="container h-full max-w-7xl pt-12">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
