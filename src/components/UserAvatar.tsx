import { AvatarFallback, AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import { Icons } from "./Icons";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.image!} referrerPolicy="no-referrer" />
      <AvatarFallback>
        <Icons.user className="h-full w-full bg-gray-300 p-2" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
