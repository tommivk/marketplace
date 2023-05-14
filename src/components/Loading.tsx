const Loading = () => {
  return (
    <div className="h-full flex gap-2 justify-center items-center">
      <span className="animate-loader h-5 w-5 bg-zinc-500 rounded-full"></span>
      <span className="animate-loader h-5 w-5 bg-zinc-500 rounded-full animation-delay-200"></span>
      <span className="animate-loader h-5 w-5 bg-zinc-500 rounded-full animation-delay-400 "></span>
    </div>
  );
};

export default Loading;
