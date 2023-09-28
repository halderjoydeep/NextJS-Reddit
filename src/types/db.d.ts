import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  author: User;
  subreddit: Subreddit;
  votes: Vote[];
  comments: Comment[];
};
