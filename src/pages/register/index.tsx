import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

const SignUpPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <Head>
        <title>Sign up</title>
      </Head>
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
