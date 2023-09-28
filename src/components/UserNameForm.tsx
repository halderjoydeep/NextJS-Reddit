"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { UsernameRequest, usernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface UserNameFormProps {
  user: Pick<User, "username" | "id">;
}

const UserNameForm: React.FC<UserNameFormProps> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(usernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const { signinToast } = useCustomToast();
  const router = useRouter();

  const { mutate: updateUsename, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name };

      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already exists.",
            description: "Please choose a different username.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid username.",
            description: "Please choose a username between 3 and 32 characters",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return signinToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not update username.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({ description: "Your username has been updated" });
      router.refresh();
    },
  });
  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateUsename(data);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="your username"
              className="w-[400px] pl-8"
              size={32}
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-xs text-red-600 ">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Update</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
