import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ZodError, z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    const url = new URL(req.url);

    let followedSubredditIds: string[] = [];

    if (session) {
      const followedSubreddits = await db.subscription.findMany({
        where: { userId: session.user.id },
        include: {
          subreddit: true,
        },
      });

      followedSubredditIds = followedSubreddits.map(
        ({ subreddit }) => subreddit.id,
      );
    }

    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get("subredditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedSubredditIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        author: true,
        votes: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create post, Please try again later.", {
      status: 500,
    });
  }
}
