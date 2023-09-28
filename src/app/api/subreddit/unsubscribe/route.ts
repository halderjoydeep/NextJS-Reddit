import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const subscriptionExist = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    });

    if (!subscriptionExist) {
      return new Response("You are not subscribed.", { status: 400 });
    }

    const isCreator = await db.subreddit.findFirst({
      where: { id: subredditId, creatorId: session.user.id },
    });

    if (isCreator) {
      return new Response("You can not leave your own subreddit", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: { userId_subredditId: { subredditId, userId: session.user.id } },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not unsubscribe, Please try again later.", {
      status: 500,
    });
  }
}
