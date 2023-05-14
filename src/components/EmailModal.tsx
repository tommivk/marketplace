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
    <div className="fixed w-screen h-screen top-0 left-0 bg-opacity-90 z-20 bg-black flex">
      <FormContainer className="relative w-fit h-max max-w-full m-auto">
        <div
          onClick={() => setModalOpen(false)}
          className="absolute right-2 top-2 p-2 w-8 h-8 text-center text-xs font-extrabold bg-zinc-700 hover:bg-zinc-600 cursor-pointer rounded-full"
        >
          X
        </div>
        {session ? (
          <>
            <FormField>
              <h1 className="text-2xl text-center mb-4">Send Email</h1>
              <FormLabel text="Message" />

              <textarea
                ref={messageRef}
                className="w-full h-64 bg-zinc-800 text-slate-200 py-2 px-4"
              />
              <p className="text-xs text-zinc-700 p-2">
                (Email will be sent to a dummy AWS address)
              </p>
            </FormField>
            <FormField>
              <Button
                className="m-auto block mt-6"
                onClick={handleSubmit}
                loading={isLoading}
              >
                Send Email
              </Button>
            </FormField>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-10 px-10 py-20 box-border">
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
