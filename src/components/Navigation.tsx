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
    <div className="w-[calc(100vw-32px)] pl-8 py-10  h-14 flex items-center z-10">
      <Link href={"/"}>
        <h1 className="font-extrabold text-2xl tracking-wide text-slate-200">
          MARKETPLACE
        </h1>
      </Link>

      <div className="flex flex-col md:flex-row grow">
        <Burger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div
          className={`
                      ${menuOpen ? "" : "hidden md:flex"}
                      absolute top-0 right-0 md:relative md:ml-auto flex-col md:flex-row flex grow items-center
                      bg-zinc-900 md:bg-transparent rounded-sm p-8 md:p-0 select-none z-10
                    `}
        >
          <div className="ml-0 md:ml-auto flex flex-col md:flex-row gap-3 md:gap-10 mt-10 md:mt-0 mb-6 md:mb-0">
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
      <p className="font-bold hover:underline underline-offset-8 decoration-2 decoration-zinc-600">
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
      className="absolute right-10 top-7 space-y-2 cursor-pointer w-fit md:hidden z-20"
    >
      <div className="w-8 h-0.5 bg-zinc-400"></div>
      <div className="w-8 h-0.5 bg-zinc-400"></div>
      <div className="w-8 h-0.5 bg-zinc-400"></div>
    </div>
  );
};
export default Navigation;
