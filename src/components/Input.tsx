import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  ref: UseFormRegisterReturn<string>;
} & React.InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line react/display-name
const Input = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => {
  return (
    <input
      {...props}
      className={`py-2 px-3 w-full text-sm 
           bg-slate-200 bg-opacity-5 
           rounded-md text-slate-200 outline-none
           border-[1px] border-transparent focus:border-slate-200
           ${props.className}
          `}
      ref={ref}
    />
  );
});

export default Input;
