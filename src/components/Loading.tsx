type Props = {
  className?: string;
  size?: "sm" | "lg";
};

const Loading = ({ className, size = "lg" }: Props) => {
  const sizes = {
    sm: "h-2 w-2",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`flex h-full items-center justify-center gap-2 ${className}`}
    >
      <span
        className={`${sizes[size]} animate-loader rounded-full bg-zinc-500`}
      ></span>
      <span
        className={`${sizes[size]} animation-delay-200 animate-loader rounded-full bg-zinc-500`}
      ></span>
      <span
        className={`${sizes[size]} animation-delay-400 animate-loader rounded-full bg-zinc-500`}
      ></span>
    </div>
  );
};

export default Loading;
