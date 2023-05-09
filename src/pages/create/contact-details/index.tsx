import { useFormStore } from "@/store/useFormStore";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
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

const ContactDetailsPage: NextPage = () => {
  const ctx = trpc.useContext();
  const formStore = useFormStore();
  const router = useRouter();

  type ContactDetails = z.infer<typeof contactDetailsSchema>;
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: formStore.contactDetails,
  });

  const { mutateAsync: createPresignedPOSTLink } =
    trpc.items.createUploadURL.useMutation();

  const { mutate: createItem } = trpc.items.create.useMutation({
    onSuccess: (data) => {
      reset();
      ctx.items.getAll.invalidate();
      toast.success("New Item Created!");
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
      const itemDetails = formStore.itemDetails;
      console.log("ITEM: ", itemDetails);
      if (!itemDetails) throw "Itemdetails data was undefined";

      const file = z.instanceof(File).parse(itemDetails.imageFile);
      const fileName = await uploadImage(file);

      delete itemDetails["imageFile"];
      createItem({ ...itemDetails, ...contactDetails, fileName });
      router.push("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create item");
    }
  };

  const handleGoBack = () => {
    const data = getValues();
    formStore.setData({ step: "contactDetails", data });
    router.push("/create");
  };

  return (
    <FormContainer>
      <h1 className="text-xl font-bold text-center mb-8">
        Add Contact Details
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <FormLabel text="Username" />
          <Input
            {...register("username")}
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
          <ErrorMessage error={errors.username} />
        </FormField>
        <FormField>
          <FormLabel text="Email" />
          <Input
            {...register("email")}
            type="text"
            placeholder="email"
            autoComplete="off"
          />
          <ErrorMessage error={errors.email} />
        </FormField>
        <FormField>
          <FormLabel text="Phone" />
          <Input
            {...register("phoneNumber")}
            type="text"
            placeholder="Phone"
            autoComplete="off"
          />
          <ErrorMessage error={errors.phoneNumber} />
        </FormField>

        <div className="flex items-center mt-10 justify-between">
          <Button onClick={handleGoBack} type="button" color="secondary">
            {"<-"}
          </Button>
          <Button type="submit">SUBMIT</Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ContactDetailsPage;
