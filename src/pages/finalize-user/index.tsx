import Button from "@/components/Button";
import FormContainer from "@/components/FormContainer";
import FormField from "@/components/FormField";
import Input from "@/components/FormInput";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import { toast } from "react-hot-toast";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

const FinalizeUser: NextPage = () => {
  const router = useRouter();

  const { mutate, isLoading } = trpc.users.updateUserName.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Username successfully added");
      router.reload();
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    if (!value) return;
    mutate({ username: value.trim() });
  };

  return (
    <FormContainer>
      <h1 className="text-center font-bold text-2xl mb-10">
        Choose a Username
      </h1>
      <FormField>
        <Input
          ref={inputRef}
          placeholder="Username"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSubmit(e);
            }
          }}
        ></Input>
        <Button
          className="m-auto block mt-10"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Submit
        </Button>
      </FormField>
    </FormContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirect = {
    destination: "/",
    permanent: false,
  };

  const { userId } = getAuth(ctx.req);
  if (!userId) {
    return {
      redirect,
    };
  }

  const user = await clerkClient.users.getUser(userId);
  if (user.publicMetadata?.finalized) {
    return {
      redirect,
    };
  }
  return { props: {} };
};

export default FinalizeUser;
