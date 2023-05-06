import Button from "@/components/Button";
import { trpc } from "@/utils/trpc";
import React from "react";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { itemSchemaWithFile } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Input from "@/components/Input";
import SelectField from "@/components/SelectField";
import DropZoneField from "@/components/DropZoneField";

type ItemSchemaWithFile = z.infer<typeof itemSchemaWithFile>;

const CreateItem = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <ItemForm />
    </div>
  );
};

const ItemForm = () => {
  const ctx = trpc.useContext();
  const router = useRouter();

  const { data: categories, isLoading } = trpc.categories.getAll.useQuery();
  const { mutateAsync: createPresignedPOSTLink } =
    trpc.items.createUploadURL.useMutation();

  const { mutate: submitForm } = trpc.items.create.useMutation({
    onSuccess: (data) => {
      reset();
      ctx.items.getAll.invalidate();
      toast.success("New Item Created!");
      router.push(`/items/${data.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ItemSchemaWithFile>({
    resolver: zodResolver(itemSchemaWithFile),
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

  const onSubmit: SubmitHandler<ItemSchemaWithFile> = async (data) => {
    try {
      const file = z.instanceof(File).parse(data.imageFile);
      const fileName = await uploadImage(file);
      delete data["imageFile"];
      submitForm({ ...data, fileName });
      console.log(data);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create item");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-zinc-900 px-6 py-6 w-[500px] m-5 rounded-lg">
      <h1 className="text-xl font-bold text-center mb-8">List New Item</h1>
      <form
        className="flex flex-col gap-2 justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField>
          <DropZoneField name="imageFile" control={control} />
          <ErrorMessage
            error={errors.imageFile as FieldError}
            className="text-center"
          />
        </FormField>

        <FormField>
          <Label text="Category" />
          <SelectField
            {...register("categoryId")}
            options={categories}
            className="mr-auto"
          />
          <ErrorMessage error={errors.categoryId} />
        </FormField>

        <FormField>
          <Label text="Title" />
          <Input
            {...register("title")}
            placeholder="Title"
            autoComplete="off"
          />
          <ErrorMessage error={errors.title} />
        </FormField>

        <FormField>
          <Label text="Price" />
          <Input
            {...register("price", {
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Price"
            autoComplete="off"
          />
          <ErrorMessage error={errors.price} />
        </FormField>

        <FormField>
          <Label text="Description" />
          <textarea
            {...register("description")}
            className="bg-zinc-800 w-full h-40 p-2 text-sm rounded-md"
            placeholder="Description"
            autoComplete="off"
          />
          <ErrorMessage error={errors.description} />
        </FormField>

        <Button className="mt-4 mx-auto" type="submit">
          SUBMIT
        </Button>
      </form>
    </div>
  );
};

const FormField = ({ children }: React.PropsWithChildren) => {
  return <div className="mb-2">{children}</div>;
};

const Label = ({ text }: { text: string }) => {
  return <p className="mr-auto ml-1 mb-1 text-xs text-slate-500">{text}</p>;
};

const ErrorMessage = ({
  error,
  className,
}: {
  error?: FieldError;
  className?: string;
}) => {
  if (!error) return <></>;
  return (
    <p className={`text-xs text-red-500 mt-2 ml-1 ${className}`}>
      {error.message}
    </p>
  );
};

export default CreateItem;
