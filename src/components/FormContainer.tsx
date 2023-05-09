const FormContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-zinc-900 px-6 py-6 w-[500px] m-5 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
