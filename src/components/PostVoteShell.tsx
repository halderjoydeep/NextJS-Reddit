import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "./ui/button";

const PostVoteShell: React.FC = () => {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      {/* Upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* Score */}
      <div className="texsm py-2 text-center font-medium text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* Upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
};

export default PostVoteShell;
