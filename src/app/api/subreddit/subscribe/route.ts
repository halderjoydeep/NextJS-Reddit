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

    if (subscriptionExist) {
      return new Response("You are already subscribed.", { status: 400 });
    }

    await db.subscription.create({
      data: { subredditId, userId: session.user.id },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not subscribe, Please try again later.", {
      status: 500,
    });
  }
}
