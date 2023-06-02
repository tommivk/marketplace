import { useFormStore } from "@/store/useFormStore";
import { GetServerSideProps, NextPage } from "next";
import { locationDataSchema } from "../../../schema";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { getAuth } from "@clerk/nextjs/server";
import Button from "@/components/Button";
import FormContainer from "@/components/FormContainer";
import ErrorMessage from "@/components/ErrorMessage";
import ArrowIcon from "@/components/ArrowIcon";
import Head from "next/head";
import Map from "@/components/Map";

const ContactDetailsPage: NextPage<{ emailAddresses: string[] }> = () => {
  const router = useRouter();
  const formStore = useFormStore();

  if (!formStore.itemDetails) {
    router.push("/create");
  }

  type LocationSchema = z.infer<typeof locationDataSchema>;

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<LocationSchema>({
    resolver: zodResolver(locationDataSchema),
    defaultValues: formStore.locationData,
  });

  const handleNext: SubmitHandler<LocationSchema> = async (data) => {
    formStore.setData({ step: "locationData", data });
    router.push("/create/contact-details");
  };

  const handleGoBack = () => {
    const data = getValues();
    formStore.setData({ step: "locationData", data });
    router.push("/create");
  };

  type LocationData = z.infer<typeof locationDataSchema>;

  const handleLocationChange = (locationData: LocationData) => {
    formStore.setData({ step: "locationData", data: locationData });
    setValue("coordinates", locationData.coordinates);
    setValue("locationString", locationData.locationString);
  };

  const { lat, lng } = formStore.locationData?.coordinates ?? {};

  return (
    <FormContainer>
      <Head>
        <title>List new Item</title>
      </Head>

      <h1 className="mb-8 text-center text-xl font-bold">Add Item Location</h1>
      <p className="mb-4 text-center text-zinc-400">
        Click on the map to select a location
      </p>
      <div className="m-auto w-[280px] sm:w-[400px]">
        <Map
          height={500}
          width={400}
          lat={lat ?? 60.17}
          lng={lng ?? 24.94}
          zoom={5}
          selectable
          onLocationChange={handleLocationChange}
        />
      </div>
      <h2 className="mt-2 text-center">
        {formStore.locationData?.locationString}
      </h2>
      <ErrorMessage error={errors.locationString} className="text-center" />

      <form onSubmit={handleSubmit(handleNext)}>
        <div className="mt-10 flex items-center justify-between">
          <Button onClick={handleGoBack} type="button" color="secondary">
            <ArrowIcon className="h-6 w-6 text-zinc-300" />
          </Button>
          <Button type="submit">NEXT</Button>
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

  return {
    props: {},
  };
};

export default ContactDetailsPage;
