import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { postValidator } from "@/lib/validators/post";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId, title, content } = postValidator.parse(body);

    const subscriptionExist = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    });

    if (!subscriptionExist) {
      return new Response("You are not subscribed.", { status: 400 });
    }

    await db.post.create({
      data: { title, content, subredditId, authorId: session.user.id },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create post, Please try again later.", {
      status: 500,
    });
  }
}
