import { z } from "zod";

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters." })
    .max(128, { message: "Title can not exceeds 128 characters" }),
  content: z.any(),
  subredditId: z.string(),
});

export type PostCreationRequest = z.infer<typeof postValidator>;
