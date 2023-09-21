import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditValidator } from "@/lib/validators/subreddit";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = subredditValidator.parse(body);

    const subredditExist = await db.subreddit.findFirst({
      where: { name },
    });

    if (subredditExist) {
      return new Response("Subreddit already exist", { status: 409 });
    }

    //   Create subreddit
    const subreddit = await db.subreddit.create({
      data: { name, creatorId: session.user.id },
    });

    //   Subsribe to own subreddit
    await db.subscription.create({
      data: { userId: session.user.id, subredditId: subreddit.id },
    });

    return new Response(name);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subreddit", { status: 500 });
  }
}
