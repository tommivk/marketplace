import { trpc } from "@/utils/trpc";
import { useRef } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import FormContainer from "./FormContainer";
import FormField from "./FormField";
import FormLabel from "./FormLabel";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

const EmailModal = ({
  itemId,
  modalOpen,
  setModalOpen,
}: {
  itemId: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { session } = useClerk();
  const router = useRouter();

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isLoading } = trpc.emails.sendEmail.useMutation({
    onSuccess: () => {
      if (messageRef.current) {
        messageRef.current.value = "";
      }
      toast.success("Email successfully sent!");
      setModalOpen(false);
    },
    onError: (e) => {
      console.error(e);
      toast.error(e.message ?? "Failed to send email");
    },
  });

  const handleSubmit = () => {
    const message = messageRef.current?.value?.trim();
    if (!message) return;
    mutate({ itemId, message });
  };

  if (!modalOpen) return <></>;

  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen bg-black bg-opacity-90">
      <FormContainer className="relative m-auto h-max w-fit max-w-full">
        <div
          onClick={() => setModalOpen(false)}
          className="absolute right-2 top-2 h-8 w-8 cursor-pointer rounded-full bg-zinc-700 p-2 text-center text-xs font-extrabold hover:bg-zinc-600"
        >
          X
        </div>
        {session ? (
          <>
            <FormField>
              <h1 className="mb-4 text-center text-2xl">Send Email</h1>
              <FormLabel text="Message" />

              <textarea
                ref={messageRef}
                className="h-64 w-full bg-zinc-800 px-4 py-2 text-slate-200"
              />
              <p className="p-2 text-xs text-zinc-700">
                (Email will be sent to a dummy AWS address)
              </p>
            </FormField>
            <FormField>
              <Button
                className="m-auto mt-6 block"
                onClick={handleSubmit}
                loading={isLoading}
              >
                Send Email
              </Button>
            </FormField>
          </>
        ) : (
          <div className="box-border flex flex-col items-center justify-center gap-10 px-10 py-20">
            <h3 className="text-xl">You must be logged in to send emails</h3>
            <Button
              onClick={() => {
                router.push(`/login?r=items/${itemId}`);
              }}
            >
              Login
            </Button>
          </div>
        )}
      </FormContainer>
    </div>
  );
};

export default EmailModal;
