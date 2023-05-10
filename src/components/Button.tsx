import LoadingSpinner from "./LoadingSpinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
};

const Button = ({ children, loading, color = "primary", ...props }: Props) => {
  const colors = {
    primary: "bg-blue-400 hover:bg-blue-300",
    secondary: "bg-slate-600 hover:bg-slate-500",
    danger: "bg-red-400 hover:bg-red-300",
  };

  return (
    <button
      disabled={loading}
      {...props}
      className={`
              ${colors[color]}
              text-slate-200 text-sm font-medium w-fit px-10 py-2 rounded-xl
              ${loading ? "pointer-events-none" : ""}
              ${props.className}
          `}
    >
      <div className="relative">
        <span className={`${loading ? "opacity-0" : ""}`}>{children}</span>
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {<LoadingSpinner />}
          </div>
        )}
      </div>
    </button>
  );
};

export default Button;
