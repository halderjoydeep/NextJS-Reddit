import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignUp: React.FC = () => {
  return (
    <div className="container flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-4 text-center">
        <Icons.Logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        {/* Sign In Form */}
        <UserAuthForm />

        {/* Sign Up CTA */}
        <p className="px-8 text-sm text-zinc-700">
          Alreadt have account?{" "}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
