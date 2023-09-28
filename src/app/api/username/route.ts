import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { usernameValidator } from "@/lib/validators/username";
import { ZodError } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name } = usernameValidator.parse(body);

    const isExisting = await db.user.findFirst({ where: { username: name } });

    if (isExisting)
      return new Response("Username already exists.", { status: 409 });

    await db.user.update({
      where: { id: session.user.id },
      data: { username: name },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subreddit", { status: 500 });
  }
}
