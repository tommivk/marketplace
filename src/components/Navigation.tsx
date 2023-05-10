import { useClerk, SignedOut, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Button from "./Button";
import Link from "next/link";

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

export default Navigation;
