import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Control, Controller } from "react-hook-form";
import { itemSchemaWithFile } from "@/schema";
import { z } from "zod";
import Image from "next/image";

type ItemSchemaWithFile = z.infer<typeof itemSchemaWithFile>;

const DropZoneField = ({
  name,
  control,
  imageFile,
}: {
  name: keyof ItemSchemaWithFile;
  control: Control<ItemSchemaWithFile>;
  imageFile?: File;
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { onChange } }) => (
        <DropZone onChange={(image) => onChange(image)} imageFile={imageFile} />
      )}
      control={control}
      defaultValue={undefined}
    />
  );
};

const DropZone = ({
  onChange,
  imageFile,
}: React.PropsWithChildren & {
  onChange: (e?: File) => void;
  imageFile?: File;
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    imageFile ? URL.createObjectURL(imageFile) : undefined
  );

  const onDrop = useCallback(
    (images: File[]) => {
      const url = URL.createObjectURL(images?.[0]);
      setImagePreview(url);
      onChange(images?.[0]);
    },
    [onChange]
  );

  const removePicture = () => {
    setImagePreview(undefined);
    onChange(undefined);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className="m-auto w-fit">
      {imagePreview ? (
        <div className="relative m-auto">
          <Image
            src={imagePreview}
            alt="Preview"
            width={200}
            height={300}
            className="object-contain h-auto max-w-full"
          />
          <button
            className={`w-7 h-7 absolute -top-3 -right-4 z-10 
                        bg-zinc-800 hover:bg-zinc-700 p-1 
                          rounded-full flex justify-center 
                          items-center font-bold text-xs
                        `}
            onClick={removePicture}
          >
            X
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="p-10 rounded-md bg-zinc-800 m-auto relative flex items-center"
        >
          <input {...getInputProps()} />
          <>
            <div className="flex flex-col items-center text-sm m-auto gap-2 cursor-pointer">
              <p>Drag Image To Upload</p>
              <p>or</p>
              <span
                role="button"
                className="bg-zinc-500 hover:bg-zinc-400 rounded-md p-1"
                onClick={open}
              >
                Browse Files
              </span>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default DropZoneField;
