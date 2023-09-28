"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [text, setText] = useState<string>("");
  const router = useRouter();

  const { signinToast } = useCustomToast();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommentRequest = { postId, text, replyToId };

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
    },
  });

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What are your thoughts?"
          rows={1}
        />

        <div className="mt-2 flex justify-end">
          <Button
            disabled={text.length === 0}
            isLoading={isLoading}
            onClick={() => comment()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
