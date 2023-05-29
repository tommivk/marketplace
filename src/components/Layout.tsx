import { PropsWithChildren, useEffect, useMemo } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Navigation from "./Navigation";
import Loading from "./Loading";

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
    <div className="flex h-full flex-col">
      <Navigation key={router.pathname} />
      {isLoading || redirectToFinalize ? (
        <Loading />
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
}
