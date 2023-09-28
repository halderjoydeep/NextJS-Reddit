"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "./ui/button";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const router = useRouter();

  const { signinToast } = useCustomToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(
        `/api/subreddit/${isSubscribed ? "unsubscribe" : "subscribe"}`,
        payload,
      );
      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return signinToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: isSubscribed ? "Unsubscribed" : "Subscribed",
        description: `You are now ${
          isSubscribed ? "unsubsribed" : "subsribed"
        } ${isSubscribed ? "from" : "to"} r/${subredditName}`,
      });
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      isLoading={isLoading}
      className="mb-4 mt-1 w-full"
    >
      {isSubscribed ? "Leave community" : "Join to post"}
    </Button>
  );
};

export default SubscribeLeaveToggle;
