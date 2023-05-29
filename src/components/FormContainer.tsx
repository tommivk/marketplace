const FormContainer = ({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) => {
  return (
    <div className={`flex h-full items-center justify-center ${className}`}>
      <div className="m-5 w-[500px] rounded-lg bg-zinc-900 px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
