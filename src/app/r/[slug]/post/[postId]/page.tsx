import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteShell from "@/components/PostVoteShell";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface pageProps {
  params: { postId: string };
}

export const dynamic = "force-dyanmic";
export const fetchCache = "force-no-store";

const page: React.FC<pageProps> = async ({ params }) => {
  const { postId } = params;
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: { id: postId },
      include: { author: true, votes: true },
    });
  }

  if (!cachedPost && !post) return notFound();

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={postId}
            getData={async () => {
              return await db.post.findUnique({
                where: { id: postId },
                include: { votes: true },
              });
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 shadow sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            <CommentsSection postId={postId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
