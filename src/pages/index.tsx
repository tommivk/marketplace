import { trpc } from "@/utils/trpc";

export default function Home() {
  const ctx = trpc.useContext();

  const { data } = trpc.users.getAll.useQuery();
  const { mutate } = trpc.users.create.useMutation({
    onSuccess: () => {
      void ctx.users.getAll.invalidate();
    },
  });

  return (
    <div>
      <div>
        Users: {data?.length}
        {data?.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <button onClick={() => mutate({ name: "New User" })}>Create</button>
    </div>
  );
}
