import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import CreateComment from "./CreateComment";
import PostComment from "./PostComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = async ({ postId }) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: { postId, replyToId: null },
    include: {
      author: true,
      votes: true,
      replies: { include: { author: true, votes: true } },
    },
  });

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      <CreateComment postId={postId} />

      <div className="mt-4 flex flex-col gap-y-6 ">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const votesAmt = topLevelComment.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              else if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const currentVoteType = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            )?.type;

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    votesAmt={votesAmt}
                    currentVoteType={currentVoteType}
                    postId={postId}
                    session={session}
                  />
                </div>

                {/* render replied */}
                {topLevelComment.replies
                  // .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const votesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      else if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const currentVoteType = reply.votes.find(
                      (vote) => vote.userId === session?.user.id,
                    )?.type;

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 border-l-2 border-zinc-200 py-2 pl-4"
                      >
                        <PostComment
                          comment={reply}
                          postId={postId}
                          session={session}
                          votesAmt={votesAmt}
                          currentVoteType={currentVoteType}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
