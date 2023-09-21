import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Breadit",
  description: "A reddit clone built with NextJS 13",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-slate-50 pt-12 text-slate-900 antialiased",
          inter.className,
        )}
      >
        <Providers>
          <Navbar />

          {authModal}

          <main className="container h-full max-w-7xl pt-12">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
