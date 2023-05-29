const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`flex h-full items-center justify-center gap-2 ${className}`}
    >
      <span className="h-5 w-5 animate-loader rounded-full bg-zinc-500"></span>
      <span className="animation-delay-200 h-5 w-5 animate-loader rounded-full bg-zinc-500"></span>
      <span className="animation-delay-400 h-5 w-5 animate-loader rounded-full bg-zinc-500 "></span>
    </div>
  );
};

export default Loading;
