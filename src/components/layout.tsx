import { PropsWithChildren } from "react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}

const Navigation = () => {
  return (
    <div className="p-5 h-14 flex items-center justify-end">
      <SignedOut>
        <Link href={"/register"}>SignUp</Link>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
};
