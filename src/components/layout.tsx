import { PropsWithChildren } from "react";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Button from "./button";
import { useRouter } from "next/router";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}

const Navigation = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    signOut();
    router.push("/");
  };

  return (
    <div className="p-5 h-14 flex items-center justify-between">
      <Link href={"/"}>Marketplace</Link>
      <SignedOut>
        <Link href={"/register"}>
          <Button>SIGN UP</Button>
        </Link>
      </SignedOut>

      <SignedIn>
        <Button onClick={handleSignout} color="secondary">
          Sign Out
        </Button>
      </SignedIn>
    </div>
  );
};
