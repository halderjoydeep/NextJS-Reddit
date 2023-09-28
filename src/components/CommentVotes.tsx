"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface CommentVotesProps {
  commentId: string;
  initialVotesAmt: number;
  initialVoteType?: VoteType | null;
}

const CommentVote: React.FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmt,
  initialVoteType,
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVoteType, setCurrentVoteType] = useState(initialVoteType);
  const prevVoteType = usePrevious(currentVoteType);
  const { signinToast } = useCustomToast();

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onError: (err, voteType) => {
      // Reset the amout
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // Reset current vote
      setCurrentVoteType(prevVoteType);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return signinToast();
      }

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    },

    onMutate: (type: VoteType) => {
      if (currentVoteType === type) {
        setCurrentVoteType(undefined);
        if (type === "UP") {
          setVotesAmt((prev) => prev - 1);
        } else {
          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVoteType(type);
        if (type === "UP")
          setVotesAmt((prev) => prev + (currentVoteType ? 2 : 1));
        else if (type === "DOWN") {
          setVotesAmt((prev) => prev - (currentVoteType ? 2 : 1));
        }
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "fill-emerald-500 text-emerald-500": currentVoteType === "UP",
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {votesAmt}
      </p>

      <Button
        size="sm"
        variant="ghost"
        aria-label="downvote"
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "fill-red-500 text-red-500": currentVoteType === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
