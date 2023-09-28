import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVoteType?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer: React.FC<PostVoteServerProps> = async ({
  postId,
  initialVotesAmt,
  initialVoteType,
  getData,
}) => {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVoteType: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);

    _currentVoteType = post.votes.find(
      (vote) => vote.userId === session?.user.id,
    )?.type;
  } else {
    _votesAmt = initialVotesAmt!;
    _currentVoteType = initialVoteType!;
  }

  return (
    <PostVoteClient
      initialVotesAmt={_votesAmt}
      initialVoteType={_currentVoteType}
      postId={postId}
    />
  );
};

export default PostVoteServer;
