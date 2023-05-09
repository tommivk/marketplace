import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  ref: UseFormRegisterReturn<string>;
  options?: { id: string; name: string }[];
} & React.InputHTMLAttributes<HTMLSelectElement>;

// eslint-disable-next-line react/display-name
const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ options, ...props }, ref) => {
    return (
      <select
        {...props}
        ref={ref}
        className={`
          bg-zinc-800 text-slate-200 text-sm px-5 py-2
          outline-none border-[1px] border-transparent focus:border-slate-200 rounded-md
          ${props.className}
        `}
        defaultValue={""}
      >
        <option value="" disabled className="bg-zink-900">
          Category
        </option>
        {options?.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    );
  }
);

export default SelectField;
