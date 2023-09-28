"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const { signinToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/subreddit/", payload);
      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exixts.",
            description: "Please choose a different subreddit name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 characters",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return signinToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <h1 className="text-xl font-semibold">Create a community</h1>

        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization can not be changed.
          </p>
        </div>

        <div className="relative">
          <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
            r/
          </p>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-6"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={router.back}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
