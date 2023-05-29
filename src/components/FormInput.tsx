import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  ref: UseFormRegisterReturn<string>;
} & React.InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line react/display-name
const FormInput = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => {
  return (
    <input
      {...props}
      className={`w-full rounded-md border-[1px] border-transparent
           bg-slate-200 bg-opacity-5
           px-3 py-2 text-sm
           text-slate-200 outline-none focus:border-slate-200
           ${props.className}
          `}
      ref={ref}
    />
  );
});

export default FormInput;
