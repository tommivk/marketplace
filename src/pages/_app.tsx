import "@/styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} appearance={{ baseTheme: dark }}>
      <Layout>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              style: {
                background: "#343434",
                color: "whitesmoke",
                fontSize: "15px",
              },
              duration: 4000,
            },
          }}
        />
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
