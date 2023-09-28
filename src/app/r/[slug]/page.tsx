import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: { slug: string };
}

const page: React.FC<pageProps> = async ({ params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: { author: true, subreddit: true, comments: true, votes: true },
        orderBy: { createdAt: "desc" },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        r/{subreddit.name}
      </h1>

      <MiniCreatePost session={session} />

      <PostFeed
        initialPosts={subreddit.posts}
        session={session}
        subredditName={slug}
      />
    </>
  );
};

export default page;
