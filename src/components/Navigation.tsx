import { useState } from "react";
import { useClerk, SignedOut, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Button from "./Button";
import Link from "next/link";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { signOut, user } = useClerk();
  const router = useRouter();

  const handleSignout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await signOut();
    router.push("/");
  };

  return (
    <div className="z-20 flex h-14  w-[calc(100vw-32px)] items-center py-10 pl-8">
      <Link href={"/"}>
        <h1 className="text-2xl font-extrabold tracking-wide text-slate-200">
          MARKETPLACE
        </h1>
      </Link>

      <div className="flex grow flex-col md:flex-row">
        <Burger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div
          className={`
                      ${menuOpen ? "" : "hidden md:flex"}
                      absolute right-0 top-0 z-10 flex grow select-none flex-col items-center rounded-sm
                      bg-zinc-900 p-8 md:relative md:ml-auto md:flex-row md:bg-transparent md:p-0
                    `}
        >
          <div className="mb-6 ml-0 mt-10 flex flex-col gap-3 md:mb-0 md:ml-auto md:mt-0 md:flex-row md:gap-10">
            <NavigationLink href="/search" text="Search" />
            {user && (
              <NavigationLink
                href={`/users/${user.username}`}
                text="Your items"
              />
            )}
            <NavigationLink href="/create" text="List New Item" />
          </div>

          <div className="ml-auto min-w-[140px]">
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
        </div>
      </div>
    </div>
  );
};

const NavigationLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link href={href}>
      <p className="font-bold decoration-zinc-600 decoration-2 underline-offset-8 hover:underline">
        {text}
      </p>
    </Link>
  );
};

const Burger = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      onClick={() => setMenuOpen(!menuOpen)}
      className="absolute right-10 top-7 z-20 w-fit cursor-pointer space-y-2 md:hidden"
    >
      <div className="h-0.5 w-8 bg-zinc-400"></div>
      <div className="h-0.5 w-8 bg-zinc-400"></div>
      <div className="h-0.5 w-8 bg-zinc-400"></div>
    </div>
  );
};
export default Navigation;
