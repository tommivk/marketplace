import { create } from "zustand";
import {
  contactDetailsSchema,
  itemSchemaWithFile,
  locationDataSchema,
} from "../schema";
import { z } from "zod";

type ItemDetailsType = z.infer<typeof itemSchemaWithFile>;
type ContactDetailsType = z.infer<typeof contactDetailsSchema>;
type LocationDataType = z.infer<typeof locationDataSchema>;
type ContactOption = "email" | "phone" | "both";

type SetDataType =
  | { step: "itemDetails"; data: ItemDetailsType }
  | { step: "contactDetails"; data: ContactDetailsType }
  | { step: "locationData"; data: LocationDataType };

export const useFormStore = create<{
  itemDetails: ItemDetailsType | undefined;
  locationData: LocationDataType | undefined;
  contactDetails: ContactDetailsType | undefined;
  contactOption: ContactOption | undefined;
  setData: ({ step, data }: SetDataType) => void;
  setContactOptionValue: ({ value }: { value: ContactOption }) => void;
  clearAll: () => void;
}>((set) => ({
  itemDetails: undefined,
  contactDetails: undefined,
  contactOption: "email",
  locationData: undefined,

  setData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [step]: data,
    })),

  clearAll: () =>
    set(() => ({
      itemDetails: undefined,
      contactDetails: undefined,
      locationData: undefined,
    })),

  setContactOptionValue: ({ value }) =>
    set(() => ({
      contactOption: value,
    })),
}));
