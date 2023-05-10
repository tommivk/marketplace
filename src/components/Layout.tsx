import { PropsWithChildren, useEffect, useMemo } from "react";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/router";

export default function Layout({ children }: PropsWithChildren) {
  const { user } = useClerk();
  const router = useRouter();

  const redirectToFinalize = useMemo(
    () =>
      router.pathname !== "/finalize-user" &&
      !!user &&
      !user.publicMetadata.finalized,
    [user, router]
  );

  useEffect(() => {
    if (redirectToFinalize) {
      router.replace("/finalize-user");
    }
  }, [redirectToFinalize, router]);

  const isLoading = user === undefined;

  return (
    <div className="flex flex-col h-full">
      <Navigation />
      {isLoading || redirectToFinalize ? (
        <>...Loading</>
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
}

const Navigation = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await signOut();
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
