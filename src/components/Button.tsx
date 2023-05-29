import LoadingSpinner from "./LoadingSpinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
};

const Button = ({ children, loading, color = "primary", ...props }: Props) => {
  const colors = {
    primary: "bg-blue-400 hover:bg-blue-300",
    secondary: "bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-700",
    danger: "bg-red-400 hover:bg-red-300",
  };

  return (
    <button
      disabled={loading}
      {...props}
      className={`
              ${colors[color]}
              w-fit rounded-xl px-10 py-2 text-sm font-medium text-slate-200
              disabled:pointer-events-none
              ${loading ? "pointer-events-none" : ""}
              ${props.className}
          `}
    >
      <div className="relative">
        <span className={`${loading ? "opacity-0" : ""}`}>{children}</span>
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {<LoadingSpinner />}
          </div>
        )}
      </div>
    </button>
  );
};

export default Button;
