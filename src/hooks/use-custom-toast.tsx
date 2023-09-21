import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "./use-toast";

export const useCustomToast = () => {
  const signinToast = () => {
    const { dismiss } = toast({
      title: "Signin required.",
      description: "You need to be signed in to do that.",
      variant: "destructive",
      action: (
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href="/sign-in"
          onClick={() => dismiss()}
        >
          Sign In
        </Link>
      ),
    });
  };

  return { signinToast };
};
