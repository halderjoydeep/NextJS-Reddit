"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { Comment, CommentVote, User, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MessageSquare } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CommentVotes from "./CommentVotes";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type ExtendedComment = Comment & { votes: CommentVote[]; author: User };

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVoteType: VoteType | undefined;
  postId: string;
  session: Session | null;
}

const PostComment: React.FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVoteType,
  session,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const router = useRouter();
  const { signinToast } = useCustomToast();

  const { mutate: reply, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId: comment.replyToId ?? comment.id,
      };

      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload,
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return signinToast();
        }
      }

      return toast({
        title: "Someething went wrong!",
        description: "Comment was not created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setText("");
      setIsReplying(false);
    },
  });

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center gap-x-2">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <p className="text-sm font-medium text-gray-900">
          u/{comment.author.username}
        </p>
        <p className="max-h-40 truncate  to-zinc-500 text-xs">
          {formatTimeToNow(new Date(comment.createdAt))}
        </p>
      </div>

      <p className="mt-2 text-sm  text-zinc-900">{comment.text}</p>

      <div className="flex flex-wrap items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVoteType={currentVoteType}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying((prev) => !prev);
          }}
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Reply
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <div className="mt-2">
              <Textarea
                id="comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What are your thoughts?"
                rows={1}
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="outline"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={text.length === 0}
                  isLoading={isLoading}
                  onClick={() => reply()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
