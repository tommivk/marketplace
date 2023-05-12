import { useFormStore } from "@/store/useFormStore";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps, NextPage } from "next";
import { contactDetailsSchema } from "../../../schema";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FormContainer from "@/components/FormContainer";
import FormField from "@/components/FormField";
import FormLabel from "@/components/FormLabel";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";
import { getAuth } from "@clerk/nextjs/server";
import { getUsersVerifiedEmailAddresses } from "@/server/utils";

const ContactDetailsPage: NextPage<{ emailAddresses: string[] }> = ({
  emailAddresses,
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formStore = useFormStore();
  if (!formStore.itemDetails) {
    router.push("/create");
  }

  type ContactDetails = z.infer<typeof contactDetailsSchema>;
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: formStore.contactDetails,
  });

  const { mutateAsync: createPresignedPOSTLink } =
    trpc.items.createUploadURL.useMutation();

  const { mutate: createItem } = trpc.items.create.useMutation({
    onSuccess: (data) => {
      toast.success("New Item Created!");
      formStore.clearAll();
      router.push(`/items/${data.id}`);
    },
  });

  const uploadImage = async (file: File) => {
    const contentLength = file.size;
    const { uploadURL, fileName } = await createPresignedPOSTLink({
      contentLength,
    });
    const result = await fetch(uploadURL, {
      method: "PUT",
      body: file,
    });
    if (!result.ok) throw "Failed to upload image";

    console.log(result);
    return fileName;
  };

  const onSubmit: SubmitHandler<ContactDetails> = async (contactDetails) => {
    try {
      setLoading(true);
      const itemDetails = formStore.itemDetails;
      console.log("ITEM: ", itemDetails);
      if (!itemDetails) throw "Itemdetails data was undefined";

      const file = z.instanceof(File).parse(itemDetails.imageFile);
      const fileName = await uploadImage(file);

      delete itemDetails["imageFile"];
      createItem({ ...itemDetails, ...contactDetails, fileName });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    const data = getValues();
    formStore.setData({ step: "contactDetails", data });
    router.push("/create");
  };

  const handleRadioChange = (value: "email" | "phone" | "both") => {
    reset();
    formStore.setContactOptionValue({ value });
  };

  const selected = formStore.contactOption;

  if (!formStore.itemDetails) return <></>;

  return (
    <FormContainer>
      <h1 className="text-xl font-bold text-center mb-8">
        Add Contact Details
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3 justify-center mb-4">
          <div className="flex flex-col items-center gap-2">
            <FormLabel text="Email" />
            <input
              type="radio"
              className="m-auto text-center"
              checked={selected === "email"}
              onChange={() => handleRadioChange("email")}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <FormLabel text="Phone" />
            <input
              type="radio"
              checked={selected === "phone"}
              onChange={() => handleRadioChange("phone")}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <FormLabel text="Both" />
            <input
              type="radio"
              checked={selected === "both"}
              onChange={() => handleRadioChange("both")}
            />
          </div>
        </div>

        {(selected === "email" || selected === "both") && (
          <FormField>
            <FormLabel text="Email (will not be displayed publicly)" />
            <select className="bg-zinc-800 w-full p-2 " {...register("email")}>
              {emailAddresses.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
            <ErrorMessage error={errors.email} />
          </FormField>
        )}

        {(selected === "phone" || selected === "both") && (
          <FormField>
            <FormLabel text="Phone (will be displayed publicly)" />
            <Input
              {...register("phoneNumber")}
              type="text"
              placeholder="Phone"
              autoComplete="off"
            />
            <ErrorMessage error={errors.phoneNumber} />
          </FormField>
        )}

        <div className="flex items-center mt-10 justify-between">
          <Button onClick={handleGoBack} type="button" color="secondary">
            {"<-"}
          </Button>
          <Button type="submit" loading={loading}>
            SUBMIT
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/login?r=create",
        permanent: false,
      },
    };
  }

  const emailAddresses = await getUsersVerifiedEmailAddresses(userId);

  return {
    props: {
      emailAddresses,
    },
  };
};

export default ContactDetailsPage;
