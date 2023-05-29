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
            className="h-auto max-w-full object-contain"
          />
          <button
            className={`absolute -right-4 -top-3 z-10 flex h-7
                        w-7 items-center justify-center
                          rounded-full bg-zinc-800 p-1
                          text-xs font-bold hover:bg-zinc-700
                        `}
            onClick={removePicture}
          >
            X
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="relative m-auto flex items-center rounded-md bg-zinc-800 p-10"
        >
          <input {...getInputProps()} />
          <>
            <div className="m-auto flex cursor-pointer flex-col items-center gap-2 text-sm">
              <p>Drag Image To Upload</p>
              <p>or</p>
              <span
                role="button"
                className="rounded-md bg-zinc-500 p-1 hover:bg-zinc-400"
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
