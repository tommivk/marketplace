import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
