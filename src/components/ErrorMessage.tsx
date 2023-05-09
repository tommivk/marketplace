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
    <p className={`text-xs text-red-500 mt-2 ml-1 ${className}`}>
      {error.message}
    </p>
  );
};

export default ErrorMessage;
