import Button from "@/components/Button";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import Image from "next/image";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { itemSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Input from "@/components/Input";
import SelectField from "@/components/SelectField";

const CreateItem = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <ItemForm />
    </div>
  );
};

const ItemForm = () => {
  const [imagePreview, setImagePreview] = useState<string>();

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

  const itemSchemaWithFile = itemSchema.extend({
    imageFiles:
      typeof window === "undefined" ? z.any() : z.instanceof(FileList),
  });
  type ItemSchemaWithFile = z.infer<typeof itemSchemaWithFile>;

  const {
    register,
    handleSubmit,
    reset,
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
      const file = z.instanceof(File).parse(data.imageFiles[0]);
      const fileName = await uploadImage(file);
      delete data["imageFiles"];
      submitForm({ ...data, fileName });
      console.log(data);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create item");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: { target: HTMLInputElement }) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      console.log("file changed");
    }
  };

  return (
    <div className="bg-zinc-900 px-10 py-6 w-[400px] m-5 rounded-md">
      <h1 className="text-xl font-bold text-center mb-6">List New Item</h1>
      <form
        className="flex flex-col gap-2 justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {imagePreview && (
          <Image src={imagePreview} alt="preview" height={300} width={300} />
        )}
        <p className="mr-auto ml-2">Upload image</p>
        <input
          {...register("imageFiles")}
          required
          type="file"
          onChange={handleFileChange}
        ></input>
        <ErrorMessage error={errors.imageFiles as FieldError} />

        <SelectField
          {...register("categoryId")}
          options={categories}
          className="mr-auto"
        />
        <ErrorMessage error={errors.categoryId} />

        <Input {...register("title")} placeholder="Title" autoComplete="off" />
        <ErrorMessage error={errors.title} />

        <Input
          {...register("description")}
          placeholder="Description"
          autoComplete="off"
        />
        <ErrorMessage error={errors.description} />

        <Input
          {...register("price", {
            valueAsNumber: true,
          })}
          type="number"
          placeholder="Price"
          autoComplete="off"
        />
        <ErrorMessage error={errors.price} />

        <Button className="mt-4">SUBMIT</Button>
      </form>
    </div>
  );
};

const ErrorMessage = ({ error }: { error?: FieldError }) => {
  if (!error) return <></>;
  return <p className="text-xs text-red-500 ">{error.message}</p>;
};

export default CreateItem;
