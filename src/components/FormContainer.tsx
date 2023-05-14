const FormContainer = ({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) => {
  return (
    <div className={`h-full flex justify-center items-center ${className}`}>
      <div className="bg-zinc-900 px-6 py-6 w-[500px] m-5 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
