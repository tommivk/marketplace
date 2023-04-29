import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <SignIn signUpUrl="/register" />
    </div>
  );
};

export default LoginPage;
