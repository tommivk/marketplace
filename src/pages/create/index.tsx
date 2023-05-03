import Button from "@/components/Button";
import { trpc } from "@/utils/trpc";
import React from "react";
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
  const ctx = trpc.useContext();
  const router = useRouter();

  const { data: categories, isLoading } = trpc.categories.getAll.useQuery();

  const { mutate: submitForm } = trpc.items.create.useMutation({
    onError: (e) => console.log("Error: ", e),
    onSuccess: (data) => {
      reset();
      ctx.items.getAll.invalidate();
      toast.success("New Item Created!");
      router.push(`/items/${data.id}`);
    },
  });

  const itemSchemaWithoutImageURL = itemSchema.omit({ imageURL: true });
  type ItemSchema = z.infer<typeof itemSchemaWithoutImageURL>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemSchema>({
    resolver: zodResolver(itemSchemaWithoutImageURL),
  });

  const onSubmit: SubmitHandler<ItemSchema> = (data) => {
    submitForm({ ...data, imageURL: "/components/potato.jpg" });
    console.log(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-zinc-900 px-10 py-6 w-[400px] m-5 rounded-md">
      <h1 className="text-xl font-bold text-center mb-6">List New Item</h1>
      <form
        className="flex flex-col gap-2 justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
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
