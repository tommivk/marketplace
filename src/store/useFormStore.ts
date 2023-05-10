import { create } from "zustand";
import { contactDetailsSchema, itemSchemaWithFile } from "../schema";
import { z } from "zod";

type ItemDetailsType = z.infer<typeof itemSchemaWithFile>;
type ContactDetailsType = z.infer<typeof contactDetailsSchema>;

type SetDataType =
  | { step: "itemDetails"; data: ItemDetailsType }
  | { step: "contactDetails"; data: ContactDetailsType };

export const useFormStore = create<{
  itemDetails: ItemDetailsType | undefined;
  contactDetails: ContactDetailsType | undefined;
  setData: ({ step, data }: SetDataType) => void;
  clearAll: () => void;
}>((set) => ({
  itemDetails: undefined,
  contactDetails: undefined,
  setData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [step]: data,
    })),
  clearAll: () =>
    set(() => ({
      itemDetails: undefined,
      contactDetails: undefined,
    })),
}));
