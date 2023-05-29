import type { FieldError } from "react-hook-form";

const ErrorMessage = ({
  error,
  className,
}: {
  error?: FieldError;
  className?: string;
}) => {
  if (!error) return <></>;
  return (
    <p className={`ml-1 mt-2 text-xs text-red-500 ${className}`}>
      {error.message}
    </p>
  );
};

export default ErrorMessage;
