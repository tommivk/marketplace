import { SignIn } from "@clerk/nextjs";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";

const LoginPage: NextPage = ({
  redirectURL,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="h-full flex justify-center items-center">
      <Head>
        <title>Sign in</title>
      </Head>
      <SignIn signUpUrl="/register" redirectUrl={redirectURL} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { r: redirectURL = "" } = query;
  return {
    props: {
      redirectURL,
    },
  };
};
export default LoginPage;
