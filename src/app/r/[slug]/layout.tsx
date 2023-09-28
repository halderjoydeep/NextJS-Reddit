import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/button";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: { author: true, votes: true },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) notFound();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: { subreddit: { name: slug }, user: { id: session.user.id } },
      });

  const isSubscribed = !!subscription;

  const memberCount = await db.subscription.count({
    where: { subreddit: { name: slug } },
  });

  return (
    <div className="mx-auto h-full max-w-7xl pt-0 sm:container">
      <div>
        {/* TODO: Button to take us back */}

        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>

          {/* Info Sidebar */}
          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last md:block">
            <p className="p-6 font-semibold">About r/{subreddit.name}</p>

            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">{memberCount}</dd>
              </div>

              {subreddit.creatorId === session?.user.id && (
                <p className="py-3 text-gray-500">
                  You created this community.
                </p>
              )}

              {subreddit.creatorId !== session?.user.id && (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              )}

              <Link
                className={buttonVariants({
                  variant: "secondary",
                  className: "mb-6 w-full divide-y-0",
                })}
                href={`/r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
