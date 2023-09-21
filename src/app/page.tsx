import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* Feed */}

        {/* Subreddit Info */}
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
          <div className="bg-emerald-100 p-6">
            <p className="flex items-center gap-1.5 font-semibold">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="p-6 pt-3 text-sm leading-6">
            <p className="text-zinc-500">
              Your personal Breadit homepage. Come here to check in with your
              favorite communities.
            </p>

            <Link
              className={buttonVariants({ className: "mt-6 w-full" })}
              href="/r/create"
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
