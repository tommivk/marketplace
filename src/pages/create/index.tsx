import Button from "@/components/Button";
import { trpc } from "@/utils/trpc";
import React from "react";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { itemSchemaWithFile } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useFormStore } from "@/store/useFormStore";
import Input from "@/components/FormInput";
import SelectField from "@/components/SelectField";
import DropZoneField from "@/components/DropZoneField";
import FormField from "@/components/FormField";
import ErrorMessage from "@/components/ErrorMessage";
import FormLabel from "@/components/FormLabel";
import FormContainer from "@/components/FormContainer";
import { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import Loading from "@/components/Loading";

type ItemSchemaWithFile = z.infer<typeof itemSchemaWithFile>;

const ItemForm = () => {
  const router = useRouter();
  const formStore = useFormStore();
  const { data: categories, isLoading } = trpc.categories.getAll.useQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ItemSchemaWithFile>({
    resolver: zodResolver(itemSchemaWithFile),
    defaultValues: formStore.itemDetails,
  });

  const onSubmit: SubmitHandler<ItemSchemaWithFile> = async (data) => {
    formStore.setData({ step: "itemDetails", data });
    router.push("/create/contact-details");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormContainer>
      <h1 className="text-xl font-bold text-center mb-8">List New Item</h1>
      <form
        className="flex flex-col gap-2 justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField>
          <DropZoneField
            name="imageFile"
            imageFile={formStore.itemDetails?.imageFile}
            control={control}
          />
          <ErrorMessage
            error={errors.imageFile as FieldError}
            className="text-center"
          />
        </FormField>

        <FormField>
          <FormLabel text="Category" />
          <SelectField
            {...register("categoryId")}
            options={categories}
            className="mr-auto"
          />
          <ErrorMessage error={errors.categoryId} />
        </FormField>

        <FormField>
          <FormLabel text="Title" />
          <Input
            {...register("title")}
            placeholder="Title"
            autoComplete="off"
          />
          <ErrorMessage error={errors.title} />
        </FormField>

        <FormField>
          <FormLabel text="Price" />
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
          <FormLabel text="Description" />
          <textarea
            {...register("description")}
            className="bg-zinc-800 w-full h-40 p-2 text-sm rounded-md"
            placeholder="Description"
            autoComplete="off"
          />
          <ErrorMessage error={errors.description} />
        </FormField>

        <Button className="mt-4 ml-auto" type="submit">
          NEXT
        </Button>
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
  return {
    props: {},
  };
};

export default ItemForm;
