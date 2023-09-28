import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { postId, text, replyToId } = commentValidator.parse(body);

    await db.comment.create({
      data: { postId, text, replyToId, authorId: session.user.id },
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not create comment at this time. Please try later",
      { status: 500 },
    );
  }
}
