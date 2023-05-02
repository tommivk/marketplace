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
      {...props}
      className={`
              ${colors[color]}
              text-slate-200 text-sm font-medium w-fit px-10 py-2 rounded-xl
              ${props.className}
          `}
    >
      {children}
    </button>
  );
};

export default Button;
